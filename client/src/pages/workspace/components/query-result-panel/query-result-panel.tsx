import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/styles';
import ResultTable from './result-table';

interface MainProps {
  dimensions: { height: number; width: number };
}

const QueryResultPanel = (props: MainProps) => {
  if (props.dimensions.height <= 100) return null;
  return (
    <StyledQueryResultPanel>
      <ResultTable />
    </StyledQueryResultPanel>
  );
};

const StyledQueryResultPanel = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 8,
  // 30px panel header
  height: 'calc(100% - 30px)',
}));

export default QueryResultPanel;
