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
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  currentQueryResultsAtom,
  currentSelectedQueryDataAtom,
  currentSqlQueryAtom,
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../../../recoil/atoms';
import {notificationService} from '../../../../services';
import {useEffect} from 'react';

const cls = generateUtilityClasses('EditorPanelActions', ['wrapper']);

const EditorPanelActions = () => {
  const channel = useRecoilValue(workspaceChannelAtom);
  const [currentSqlQuery, setCurrentSqlQuery] =
    useRecoilState(currentSqlQueryAtom);
  const setCurrentQueryResults = useSetRecoilState(currentQueryResultsAtom);
  const currentSelectedQueryData = useRecoilValue(currentSelectedQueryDataAtom);
  const currentWorkspaceInfo = useRecoilValue(currentWorkspaceInfoAtom);

  /** clean-up - reset query results on workspace change */
  useEffect(() => {
    setCurrentQueryResults(undefined);
  }, [currentWorkspaceInfo]);

  const handleRunQuery = () => {
    const request = {
      connectionString: currentWorkspaceInfo?.dbConnectionString!,
      queryString: currentSqlQuery,
      dataBaseType: 1,
      pageSize: 10,
      pageNumber: 1,
    };

    channel?.push('run_query', request).receive('ok', (response) => {
      if (response.success) {
        setCurrentQueryResults(response.data);
      } else {
        notificationService.notify({
          variant: 'error',
          message: 'Error at running query',
          method: 'run_query',
        });
      }
    });
  };

  const handleFormatQuery = () => {
    const request = {
      queryString: currentSqlQuery,
    };
    channel?.push('format_query', request).receive('ok', (response) => {
      if (response.success) {
        setCurrentSqlQuery(response.data);
      } else {
        notificationService.notify({
          variant: 'error',
          message: 'Could not format query',
          method: 'format_query',
        });
      }
    });
  };

  const handleSaveQuery = () => {
    if (currentSelectedQueryData !== undefined) {
      const request = {
        queryId: currentSelectedQueryData.id,
        folderId: currentSelectedQueryData.folderId,
        collectionId: currentSelectedQueryData.collectionId,
        rawSql: currentSqlQuery,
        documentation: currentSelectedQueryData.documentation // todo
      };
      channel?.push('update_query', request).receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            variant: 'success',
            message: response.message,
            method: 'save_query_raw_sql',
          });
        } else {
          notificationService.notify({
            variant: 'error',
            message: 'Could not update query',
            method: 'save_query_raw_sql',
          });
        }
      });
    }
  };

  return (
    <StyledEditorPanelActions className={cls.wrapper}>
      <Tooltip title={'Execute query'}>
        <StyledActionIconButton onClick={handleRunQuery} variant={'success'}>
          <PlayCircleFilledIcon/>
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip onClick={handleFormatQuery} title={'Format query'}>
        <StyledActionIconButton variant={'info'}>
          <LocalFloristOutlinedIcon/>
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip title={'See documentation'}>
        <StyledActionIconButton variant={'info'}>
          <BookOutlinedIcon/>
        </StyledActionIconButton>
      </Tooltip>

      <Tooltip onClick={handleSaveQuery} title={'Save query'}>
        <StyledActionIconButton variant={'success'}>
          <SaveOutlinedIcon/>
        </StyledActionIconButton>
      </Tooltip>

      <Tooltip title={'Pull updates'}>
        <StyledActionIconButton variant={'warning'}>
          <SyncAltOutlinedIcon/>
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip title={'Delete query'}>
        <StyledActionIconButton variant={'error'}>
          <DeleteOutlinedIcon/>
        </StyledActionIconButton>
      </Tooltip>
    </StyledEditorPanelActions>
  );
};

const StyledEditorPanelActions = styled(`div`)(({theme}) => ({
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
})<StyledEditorPanelIconActionButtonProps>(({theme, variant}) => ({
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
