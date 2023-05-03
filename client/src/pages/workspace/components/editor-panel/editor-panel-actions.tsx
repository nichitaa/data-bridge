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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentQueryDocsAtom,
  currentQueryResultsAtom,
  currentSelectedQueryDataAtom,
  currentSqlQueryAtom,
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../../../recoil/atoms';
import { notificationService } from '../../../../services';
import { useEffect } from 'react';

const cls = generateUtilityClasses('EditorPanelActions', ['wrapper']);

const EditorPanelActions = () => {
  const channel = useRecoilValue(workspaceChannelAtom);
  const [currentSqlQuery, setCurrentSqlQuery] =
    useRecoilState(currentSqlQueryAtom);
  const currentQueryDocs = useRecoilValue(currentQueryDocsAtom);
  const [currentQueryResults, setCurrentQueryResults] = useRecoilState(
    currentQueryResultsAtom
  );
  const currentSelectedQueryData = useRecoilValue(currentSelectedQueryDataAtom);
  const currentWorkspaceInfo = useRecoilValue(currentWorkspaceInfoAtom);
  const queryId = currentSelectedQueryData?.id;
  const folderId = currentSelectedQueryData?.folderId;
  const collectionId = currentSelectedQueryData?.collectionId;

  /** clean-up - reset query results on workspace change */
  useEffect(() => {
    setCurrentQueryResults(undefined);
  }, [currentWorkspaceInfo]);

  const handleRunQuery = () => {
    const request = {
      connectionString: currentWorkspaceInfo?.dbConnectionString!,
      queryString: currentSqlQuery,
      dataBaseType: currentWorkspaceInfo?.dataBaseType,
      pageSize: currentQueryResults?.pageSize ?? 10,
      pageNumber: currentQueryResults?.currentPage ?? 1,
    };

    channel?.push('run_query', request).receive('ok', (response) => {
      if (response.success) {
        setCurrentQueryResults(response.data);
      } else {
        notificationService.notify({
          variant: 'error',
          message: response.error,
          method: 'run_query',
        });
      }
    });
  };

  const handleDeleteQuery = () => {
    channel
      ?.push('delete_resource', {
        id: queryId,
        folderId,
        collectionId,
        type: 'query',
      })
      .receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            message: 'Query deleted!',
            variant: 'success',
            method: 'delete_resource',
          });
        } else {
          notificationService.notify({
            message: 'Could not delete query!',
            variant: 'error',
            method: 'delete_resource',
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
        documentation: currentQueryDocs,
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

  const disabledQueryActionButtons = currentSelectedQueryData === undefined;

  return (
    <StyledEditorPanelActions className={cls.wrapper}>
      <Tooltip title={'Execute query'}>
        <StyledActionIconButton onClick={handleRunQuery} variant={'success'}>
          <PlayCircleFilledIcon />
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip onClick={handleFormatQuery} title={'Format query'}>
        <StyledActionIconButton variant={'info'}>
          <LocalFloristOutlinedIcon />
        </StyledActionIconButton>
      </Tooltip>
      <Tooltip onClick={handleSaveQuery} title={'Save query SQL & docs'}>
        <span>
          <StyledActionIconButton
            disabled={disabledQueryActionButtons}
            variant={'success'}
          >
            <SaveOutlinedIcon />
          </StyledActionIconButton>
        </span>
      </Tooltip>
      <Tooltip title={'Pull updates'}>
        <span>
          <StyledActionIconButton
            disabled={disabledQueryActionButtons}
            variant={'warning'}
          >
            <SyncAltOutlinedIcon />
          </StyledActionIconButton>
        </span>
      </Tooltip>
      <Tooltip onClick={handleDeleteQuery} title={'Delete query'}>
        <span>
          <StyledActionIconButton
            disabled={disabledQueryActionButtons}
            variant={'error'}
          >
            <DeleteOutlinedIcon />
          </StyledActionIconButton>
        </span>
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
  variant?: 'error' | 'success' | 'warning' | 'info' | 'primary';
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
    : variant === 'primary'
    ? {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        color: theme.palette.info.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.3),
        },
      }
    : {}),
  [`& .${svgIconClasses.root}`]: {
    fontSize: 18,
  },
}));

export default EditorPanelActions;
