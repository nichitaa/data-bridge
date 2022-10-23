import {
  alpha,
  generateUtilityClasses,
  IconButton,
  IconButtonProps,
  styled,
  svgIconClasses,
  Tooltip,
} from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';

const cls = generateUtilityClasses('EditorPanelActions', ['wrapper']);

const EditorPanelActions = () => {
  return (
    <StyledEditorPanelActions className={cls.wrapper}>
      <Tooltip title={'Execute query'}>
        <StyledEditorPanelIconActionButton variant={'success'}>
          <PlayCircleFilledIcon />
        </StyledEditorPanelIconActionButton>
      </Tooltip>
      <Tooltip title={'Format query'}>
        <StyledEditorPanelIconActionButton variant={'info'}>
          <LocalFloristOutlinedIcon />
        </StyledEditorPanelIconActionButton>
      </Tooltip>
      <Tooltip title={'See documentation'}>
        <StyledEditorPanelIconActionButton variant={'info'}>
          <BookOutlinedIcon />
        </StyledEditorPanelIconActionButton>
      </Tooltip>

      <Tooltip title={'Save query'}>
        <StyledEditorPanelIconActionButton variant={'success'}>
          <SaveOutlinedIcon />
        </StyledEditorPanelIconActionButton>
      </Tooltip>

      <Tooltip title={'Pull updates'}>
        <StyledEditorPanelIconActionButton variant={'warning'}>
          <SyncAltOutlinedIcon />
        </StyledEditorPanelIconActionButton>
      </Tooltip>
      <Tooltip title={'Delete query'}>
        <StyledEditorPanelIconActionButton variant={'error'}>
          <DeleteOutlinedIcon />
        </StyledEditorPanelIconActionButton>
      </Tooltip>
    </StyledEditorPanelActions>
  );
};

const StyledEditorPanelActions = styled(`div`)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
}));

interface StyledEditorPanelIconActionButtonProps extends IconButtonProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
}

export const StyledEditorPanelIconActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['variant'].includes(prop as string),
})<StyledEditorPanelIconActionButtonProps>(({ theme, variant }) => ({
  marginLeft: 8,
  borderRadius: 4,
  padding: 2,
  ...(variant === 'error'
    ? {
        backgroundColor: alpha(theme.palette.error.main, 0.2),
        color: theme.palette.error.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.error.main, 0.3),
        },
      }
    : variant === 'success'
    ? {
        backgroundColor: alpha(theme.palette.success.main, 0.2),
        color: theme.palette.success.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.success.main, 0.3),
        },
      }
    : variant === 'warning'
    ? {
        backgroundColor: alpha(theme.palette.warning.main, 0.2),
        color: theme.palette.warning.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.warning.main, 0.3),
        },
      }
    : variant === 'info'
    ? {
        backgroundColor: alpha(theme.palette.info.main, 0.2),
        color: theme.palette.info.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.info.main, 0.3),
        },
      }
    : {}),
  [`& .${svgIconClasses.root}`]: {
    fontSize: 18,
  },
}));

export default EditorPanelActions;
