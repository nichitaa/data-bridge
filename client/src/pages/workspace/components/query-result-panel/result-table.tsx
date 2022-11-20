import { currentQueryResultsAtom } from '../../../../recoil/atoms';
import { useRecoilValue } from 'recoil';
import { useMemo } from 'react';
import {
  Pagination,
  PropertyFilter,
  Table,
  TableProps,
} from '@cloudscape-design/components';
import {
  PropertyFilterProperty,
  useCollection,
} from '@cloudscape-design/collection-hooks';
import {
  getFilterCountText,
  PROPERTY_FILTERING_I18N_CONSTANTS,
} from '../../../../utils/table.utils';

const ResultTable = () => {
  const currentQueryResults = useRecoilValue(currentQueryResultsAtom);

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

  const filteringProperties: PropertyFilterProperty[] = useMemo(() => {
    if (currentQueryResults === undefined) return [];
    const firstRecord = currentQueryResults.results?.[0] ?? {};
    return (
      Object.keys(firstRecord).map((colName) => ({
        propertyLabel: colName,
        key: colName,
        groupValuesLabel: colName,
        operators: [':', '!:', '=', '!='],
      })) ?? []
    );
  }, [currentQueryResults]);

  const useCollectionResult = useCollection(data, {
    pagination: { pageSize: 5 },
    propertyFiltering: { filteringProperties: filteringProperties },
    filtering: {},
    sorting: {},
  });

  const {
    collectionProps,
    items,
    paginationProps,
    filteredItemsCount,
    propertyFilterProps,
  } = useCollectionResult;

  const filterCountText = getFilterCountText(filteredItemsCount);

  return (
    <Table
      {...collectionProps}
      variant={'container'}
      items={items}
      columnDefinitions={columnDefinitions}
      resizableColumns
      // TODO: handle pagination
      pagination={<Pagination {...paginationProps} />}
      filter={
        <PropertyFilter
          i18nStrings={PROPERTY_FILTERING_I18N_CONSTANTS}
          countText={filterCountText}
          {...propertyFilterProps}
          expandToViewport
        />
      }
    />
  );
};

export default ResultTable;
