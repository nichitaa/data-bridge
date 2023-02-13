import {
  alpha,
  Box,
  generateUtilityClasses,
  styled,
  Typography,
  typographyClasses,
} from '@mui/material';
import EditorPanelActions from './editor-panel-actions';

const cls = generateUtilityClasses('EditorPanelHeader', [
  'wrapper',
  'editorHeaderWrapper',
]);

const EditorPanelHeader = () => {
  return (
    <>
      <StyledEditorPanelHeader className={cls.wrapper}>
        <Box className={cls.editorHeaderWrapper}>
          <Typography component={'div'}>Query Editor</Typography>
        </Box>
        <EditorPanelActions />
      </StyledEditorPanelHeader>
    </>
  );
};

const StyledEditorPanelHeader = styled(Box)(({ theme }) => ({
  // -1px because of the border from Result panel
  height: 29,
  display: 'flex',
  paddingLeft: 8,
  paddingRight: 8,
  justifyContent: 'space-between',
  alignItems: 'center',
  overflowX: 'auto',
  overflowY: 'hidden',
  border: `1px solid ${alpha('#fff', 0.1)}`,
  [`& .${cls.editorHeaderWrapper}`]: {
    display: 'flex',
    height: '100%',
    paddingRight: 6,
    [`& .${typographyClasses.root}`]: {
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    },
  },
}));

export default EditorPanelHeader;
