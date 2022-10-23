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
        <StyledActionIconButton variant={'success'}>
          <PlayCircleFilledIcon />
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip title={'Format query'}>
        <StyledActionIconButton variant={'info'}>
          <LocalFloristOutlinedIcon />
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip title={'See documentation'}>
        <StyledActionIconButton variant={'info'}>
          <BookOutlinedIcon />
        </StyledActionIconButton>
      </Tooltip>

      <Tooltip title={'Save query'}>
        <StyledActionIconButton variant={'success'}>
          <SaveOutlinedIcon />
        </StyledActionIconButton>
      </Tooltip>

      <Tooltip title={'Pull updates'}>
        <StyledActionIconButton variant={'warning'}>
          <SyncAltOutlinedIcon />
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip title={'Delete query'}>
        <StyledActionIconButton variant={'error'}>
          <DeleteOutlinedIcon />
        </StyledActionIconButton>
      </Tooltip>
    </StyledEditorPanelActions>
  );
};

const StyledEditorPanelActions = styled(`div`)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
}));

interface StyledEditorPanelIconActionButtonProps extends IconButtonProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
}

export const StyledActionIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['variant'].includes(prop as string),
})<StyledEditorPanelIconActionButtonProps>(({ theme, variant }) => ({
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
