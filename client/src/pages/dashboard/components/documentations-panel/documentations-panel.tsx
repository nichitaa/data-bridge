import { usePanelResize } from '../../../../hooks/use-panel-resize';
import {
  documentationPanelMaxSizeAtom,
  documentationPanelMinSizeAtom,
  documentationPanelSizeAtom,
} from '../../../../recoil/atoms';
import { Box, BoxProps, Tooltip } from '@mui/material';
import { styled } from '@mui/styles';
import DocumentationsEditor from './documentations-editor';
import SettingsEthernetOutlinedIcon from '@mui/icons-material/SettingsEthernetOutlined';
import { StyledActionIconButton } from '../editor-panel/editor-panel-actions';

interface MainProps {
  dimensions: { height: number; width: number };
}

const DocumentationsPanel = (props: MainProps) => {
  const { maximizePanel } = usePanelResize({
    sizeAtom: documentationPanelSizeAtom,
    maxSizeAtom: documentationPanelMaxSizeAtom,
    minSizeAtom: documentationPanelMinSizeAtom,
  });

  const handleMaximizePanel = () => maximizePanel(600, 200);

  if (props.dimensions.width <= 35) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: '4px' }}>
        <Tooltip title={'Expand documentation panel'}>
          <StyledActionIconButton
            variant={'info'}
            onClick={handleMaximizePanel}
          >
            <SettingsEthernetOutlinedIcon />
          </StyledActionIconButton>
        </Tooltip>
      </Box>
    );
  }
  return (
    <StyledDocumentationPanel>
      <DocumentationsEditor />
    </StyledDocumentationPanel>
  );
};

const StyledDocumentationPanel = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 8,
  height: '100%',
  minWidth: 425,
}));

export default DocumentationsPanel;
