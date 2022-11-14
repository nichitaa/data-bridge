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
  typographyClasses,
} from '@mui/material';
import EditorPanelActions, {
  StyledActionIconButton,
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
              <StyledActionIconButton variant={'warning'}>
                <DriveFileRenameOutlineOutlinedIcon />
              </StyledActionIconButton>
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
    [`& .${cls.queryNameTextField}`]: {
      paddingLeft: 20,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      [`& .${textFieldClasses.root}`]: {
        minWidth: 60,
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
