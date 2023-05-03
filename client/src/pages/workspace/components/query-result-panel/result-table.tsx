import {
  currentQueryResultsAtom,
  currentSqlQueryAtom,
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../../../recoil/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import { Pagination, Table, TableProps } from '@cloudscape-design/components';
import { Typography } from '@mui/material';
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
    const firstRecord = currentQueryResults.results?.[0] ?? {};
    return Object.keys(firstRecord).map((colName) => ({
      id: colName,
      header: colName,
      sortingField: colName,
      cell: (item) => item[colName],
    }));
  }, [currentQueryResults]);

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

  if (data.length === 0)
    return <Typography>Execute a query to inspect returned data</Typography>;

  return (
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
  );
};

export default ResultTable;
