import { usePanelResize } from '../../../../hooks/use-panel-resize';
import {
  documentationPanelMaxSizeAtom,
  documentationPanelMinSizeAtom,
  documentationPanelSizeAtom,
} from '../../../../recoil/atoms';
import { Box, BoxProps } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { StyledIconButton } from '../collections-panel/collections-panel';
import { styled } from '@mui/styles';

interface MainProps {
  dimensions: { height: number; width: number };
}

const DocumentationsPanel = (props: MainProps) => {
  const { maximizePanel } = usePanelResize({
    sizeAtom: documentationPanelSizeAtom,
    maxSizeAtom: documentationPanelMaxSizeAtom,
    minSizeAtom: documentationPanelMinSizeAtom,
  });

  const handleMaximizePanel = () => maximizePanel(600);

  if (props.dimensions.width <= 35) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: '8px' }}>
        <StyledIconButton size={'small'} onClick={handleMaximizePanel}>
          <ArrowBackIosNewIcon sx={{ fontSize: 16 }} />
        </StyledIconButton>
      </Box>
    );
  }
  return <StyledDocumentationPanel>Documentation</StyledDocumentationPanel>;
};

const StyledDocumentationPanel = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 8,
  height: '100%',
}));

export default DocumentationsPanel;
