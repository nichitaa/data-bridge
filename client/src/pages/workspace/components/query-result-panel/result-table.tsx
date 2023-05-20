import {
  currentQueryResultsAtom,
  currentSelectedQueryDataAtom,
  currentSqlQueryAtom,
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../../../recoil/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMemo, useState } from 'react';
import { Pagination, Table, TableProps } from '@cloudscape-design/components';
import { Button, Dialog, DialogContent, Typography } from '@mui/material';
import { notificationService } from '../../../../services';
import { produce } from 'immer';

const ResultTable = () => {
  const currentQueryResults = useRecoilValue(currentQueryResultsAtom);
  const channel = useRecoilValue(workspaceChannelAtom);
  const [currentSqlQuery, setCurrentSqlQuery] =
    useRecoilState(currentSqlQueryAtom);
  const currentWorkspaceInfo = useRecoilValue(currentWorkspaceInfoAtom);
  const [queryResults, setCurrentQueryResults] = useRecoilState(
    currentQueryResultsAtom
  );
  const [currentSelectedQueryData, setCurrentSelectedQueryData] =
    useRecoilState(currentSelectedQueryDataAtom);
  const [previewSnapshotModal, setPreviewSnapshotModal] = useState(false);

  const data: Record<string, string>[] = useMemo(() => {
    return (
      currentQueryResults?.results?.map((record) => {
        const keys = Object.keys(record);
        return keys.reduce((acc, curr) => {
          if (
            typeof record[curr] === 'object' ||
            typeof record[curr] === 'boolean'
          ) {
            acc[curr] = JSON.stringify(record[curr]);
          } else {
            acc[curr] = record[curr];
          }
          return acc;
        }, {});
      }) ?? []
    );
  }, [currentQueryResults]);

  const columnDefinitions: TableProps['columnDefinitions'] = useMemo(() => {
    if (currentQueryResults === undefined) return [];
    return getColumnDefinitions(currentQueryResults.results);
  }, [currentQueryResults]);

  const snapshotTableColumnDefinitions: TableProps['columnDefinitions'] =
    useMemo(() => {
      if (!currentSelectedQueryData?.snapshot) return [];
      return getColumnDefinitions(
        JSON.parse(currentSelectedQueryData.snapshot!)
      );
    }, [currentSelectedQueryData]);

  const snapshotTableItems: TableProps['items'] = useMemo(() => {
    if (!currentSelectedQueryData?.snapshot) return [];
    return JSON.parse(currentSelectedQueryData.snapshot);
  }, [currentSelectedQueryData]);

  const handlePaginateCurrentQuery = (pageNumber: number) => {
    const request = {
      connectionString: currentWorkspaceInfo?.dbConnectionString!,
      queryString: currentSqlQuery,
      dataBaseType: currentWorkspaceInfo?.dataBaseType,
      pageSize: 10,
      pageNumber,
    };
    setCurrentQueryResults(
      produce((draft) => {
        if (draft) draft.loading = true;
      })
    );
    channel?.push('run_query', request).receive('ok', (response) => {
      if (response.success) {
        setCurrentQueryResults(response.data);
      } else {
        notificationService.notify({
          variant: 'error',
          message: response.error,
          method: 'run_query',
        });
      }
    });
  };

  if (data.length === 0 && !previewSnapshotModal) {
    if (currentSelectedQueryData?.snapshot) {
      return (
        <Button onClick={() => setPreviewSnapshotModal(true)}>
          Preview snapshot
        </Button>
      );
    }
    return <Typography>Execute a query to inspect returned data</Typography>;
  }

  return (
    <>
      <Table
        items={data}
        sortingDisabled
        columnDefinitions={columnDefinitions}
        resizableColumns
        loading={queryResults?.loading}
        loadingText={'Running query...'}
        pagination={
          <Pagination
            currentPageIndex={currentQueryResults?.currentPage ?? 1}
            pagesCount={currentQueryResults?.totalPages ?? 0}
            onChange={({ detail: { currentPageIndex } }) =>
              handlePaginateCurrentQuery(currentPageIndex)
            }
          />
        }
      />
      <Dialog
        open={previewSnapshotModal}
        onClose={() => setPreviewSnapshotModal(false)}
        PaperProps={{ sx: { background: 'transparent' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Table
            items={snapshotTableItems}
            sortingDisabled
            columnDefinitions={snapshotTableColumnDefinitions}
            resizableColumns
            loading={queryResults?.loading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export const getColumnDefinitions = (
  list: any[] | undefined
): TableProps['columnDefinitions'] => {
  if (list === undefined) return [];
  const firstRecord = list[0] ?? {};
  return Object.keys(firstRecord).map((colName) => ({
    id: colName,
    header: colName,
    sortingField: colName,
    cell: (item) => item[colName],
  }));
};

export default ResultTable;
