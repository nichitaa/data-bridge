import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { alpha, Box, BoxProps, IconButton } from '@mui/material';
import { usePanelResize } from '../../../../hooks/use-panel-resize';
import {
  collectionsPanelMaxSizeAtom,
  collectionsPanelMinSizeAtom,
  collectionsPanelSizeAtom,
} from '../../../../recoil/atoms';
import { styled } from '@mui/styles';

interface MainProps {
  dimensions: { height: number; width: number };
}

const CollectionsPanel = (props: MainProps) => {
  const { maximizePanel } = usePanelResize({
    minSizeAtom: collectionsPanelMinSizeAtom,
    maxSizeAtom: collectionsPanelMaxSizeAtom,
    sizeAtom: collectionsPanelSizeAtom,
  });

  const handleMaximizePanel = () => maximizePanel(300);

  if (props.dimensions.width <= 35) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: '8px' }}>
        <StyledIconButton size={'small'} onClick={handleMaximizePanel}>
          <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
        </StyledIconButton>
      </Box>
    );
  }
  return (
    <StyledCollectionPanel>
      Collections
    </StyledCollectionPanel>
  );
};

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.5),
  borderRadius: 4,
  padding: 2,
}));

const StyledCollectionPanel = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 8,
  height: '100%',
}));

export default CollectionsPanel;
