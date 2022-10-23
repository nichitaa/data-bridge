import {
  alpha,
  Box,
  generateUtilityClasses,
  outlinedInputClasses,
  styled,
  TextField,
  textFieldClasses,
  Tooltip,
  Typography,
} from '@mui/material';
import EditorPanelActions, {
  StyledEditorPanelIconActionButton,
} from './editor-panel-actions';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

const cls = generateUtilityClasses('EditorPanelHeader', [
  'wrapper',
  'editorHeaderWrapper',
  'queryNameTextField',
]);

const EditorPanelHeader = () => {
  return (
    <>
      <StyledEditorPanelHeader className={cls.wrapper}>
        <Box className={cls.editorHeaderWrapper}>
          <Typography component={'div'}>Query Editor</Typography>
          <Box className={cls.queryNameTextField}>
            <TextField disabled={true} value={'query name'} />
            <Tooltip title={'Rename query'}>
              <StyledEditorPanelIconActionButton variant={'warning'}>
                <DriveFileRenameOutlineOutlinedIcon />
              </StyledEditorPanelIconActionButton>
            </Tooltip>
          </Box>
        </Box>
        <EditorPanelActions />
      </StyledEditorPanelHeader>
    </>
  );
};

const StyledEditorPanelHeader = styled(Box)(({ theme }) => ({
  // -1px because of the border from Result panel
  height: 29,
  overflow: 'hidden',
  display: 'flex',
  paddingLeft: 8,
  paddingRight: 8,
  justifyContent: 'space-between',
  alignItems: 'center',
  border: `1px solid ${alpha('#fff', 0.1)}`,
  [`& .${cls.editorHeaderWrapper}`]: {
    display: 'flex',
    height: '100%',
    [`& .${cls.queryNameTextField}`]: {
      paddingLeft: 20,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      [`& .${textFieldClasses.root}`]: {
        height: '22px',
        [`& .${outlinedInputClasses.root}`]: {
          // border: '1px solid red',
          height: '100%',
        },
        [`& .${outlinedInputClasses.input}`]: {
          fontSize: '14px',
        },
      },
    },
  },
}));

export default EditorPanelHeader;
