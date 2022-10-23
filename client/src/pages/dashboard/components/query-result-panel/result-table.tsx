import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { Box, styled } from '@mui/material';

const rows: GridRowsProp = [
  { id: 1, name: 'John Doe', city: 'New York' },
  { id: 2, name: 'George Mus', city: 'London' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'city', headerName: 'City'},
];

const ResultTable = () => {
  return (
    <StyledDataGridWrapper>
      <DataGrid
        rows={rows}
        columns={columns}
        density={'compact'}
        disableSelectionOnClick={true}
        loading={false}
        getRowId={(row) => row.id}
      />
    </StyledDataGridWrapper>
  );
};

const StyledDataGridWrapper = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
}));

export default ResultTable;
