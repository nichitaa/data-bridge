import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/styles';

interface MainProps {
  dimensions: { height: number; width: number };
}

const QueryResultPanel = (props: MainProps) => {
  if (props.dimensions.height <= 60) return null;
  return (
    <StyledQueryResultPanel>Here will be the table</StyledQueryResultPanel>
  );
};

const StyledQueryResultPanel = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 8,
  height: '100%',
  overflow: 'auto',
}));

export default QueryResultPanel;
