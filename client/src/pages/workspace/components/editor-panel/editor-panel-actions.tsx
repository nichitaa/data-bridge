import {
  alpha,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  generateUtilityClasses,
  IconButton,
  IconButtonProps,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  svgIconClasses,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import LocalFloristOutlinedIcon from '@mui/icons-material/LocalFloristOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PsychologyIcon from '@mui/icons-material/Psychology';
import UpdateIcon from '@mui/icons-material/Update';
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
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { produce } from 'immer';
import { blueGrey } from '@mui/material/colors';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import { LoadingButton } from '@mui/lab';

const cls = generateUtilityClasses('EditorPanelActions', ['wrapper']);

const cronJobModalDefaultState: {
  open: boolean;
  collaborators: string[];
  expression: string;
} = {
  open: false,
  collaborators: [],
  expression: '',
};
const chatGPTModalDefaultState: {
  open: boolean;
  response: string[];
  loading: boolean;
} = {
  open: false,
  response: [],
  loading: false,
};

const EditorPanelActions = () => {
  const channel = useRecoilValue(workspaceChannelAtom);
  const [currentSqlQuery, setCurrentSqlQuery] =
    useRecoilState(currentSqlQueryAtom);
  const [cronJobModal, setCronJobModal] = useState(cronJobModalDefaultState);
  const [gptModal, setGptModal] = useState(chatGPTModalDefaultState);
  const currentQueryDocs = useRecoilValue(currentQueryDocsAtom);
  const [currentQueryResults, setCurrentQueryResults] = useRecoilState(
    currentQueryResultsAtom
  );
  const [currentSelectedQueryData, setCurrentSelectedQueryData] =
    useRecoilState(currentSelectedQueryDataAtom);
  const workspace = useRecoilValue(currentWorkspaceInfoAtom);
  const queryId = currentSelectedQueryData?.id;
  const folderId = currentSelectedQueryData?.folderId;
  const collectionId = currentSelectedQueryData?.collectionId;

  /** clean-up - reset query results on workspace change */
  useEffect(() => {
    setCurrentQueryResults(undefined);
  }, [workspace?.id, currentSelectedQueryData?.id]);

  const handleRunQuery = (enableAI: boolean) => {
    const request = {
      connectionString: workspace?.dbConnectionString!,
      queryString: currentSqlQuery,
      dataBaseType: workspace?.dataBaseType,
      pageSize: currentQueryResults?.pageSize ?? 10,
      pageNumber: currentQueryResults?.currentPage ?? 1,
      enableAI,
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

  const handleCronJobCollaboratorsChange = (
    event: SelectChangeEvent<string[]>
  ) => {
    const {
      target: { value },
    } = event;
    setCronJobModal(
      produce((draft) => {
        if (typeof value === 'string') {
          draft.collaborators = value.split(',');
        } else {
          draft.collaborators = value;
        }
      })
    );
  };

  const handleSetupCronJob = () => {
    if (
      _.isEmpty(cronJobModal.expression) ||
      _.isEmpty(cronJobModal.collaborators)
    ) {
      return notificationService.notify({
        variant: 'error',
        message: 'Cron expression and email list of collaborators is required!',
        method: 'setup_cron',
      });
    }

    const request = {
      connectionString: workspace?.dbConnectionString,
      dbType: workspace?.dataBaseType,
      emailList: cronJobModal.collaborators.join(';'),
      cronExpression: cronJobModal.expression,
      queryId: queryId,
    };
    channel?.push('setup_cron', request).receive('ok', (response) => {
      if (response.success) {
        notificationService.notify({
          variant: 'success',
          message: 'Successfully created scheduled query job',
          method: 'setup_cron',
        });
      } else {
        notificationService.notify({
          variant: 'error',
          message: 'Could not create scheduled query job',
          method: 'setup_cron',
        });
      }
    });
  };

  const handleRemoveCronJob = () => {
    const request = {
      cronId: currentSelectedQueryData?.cronJob?.id,
    };
    channel?.push('stop_cron', request).receive('ok', (response) => {
      if (response.success) {
        notificationService.notify({
          variant: 'success',
          message: 'Cron job successfully removed',
          method: 'stop_cron',
        });
      } else {
        notificationService.notify({
          variant: 'error',
          message: 'Could not remove cron job',
          method: 'stop_cron',
        });
      }
    });
  };

  const handleChatGPTImproveRequest = () => {
    const request = {
      query: currentSqlQuery,
    };
    setGptModal((prev) => ({ ...prev, loading: true }));
    channel?.push('chat_gpt_improve', request).receive('ok', (response) => {
      setGptModal((prev) => ({ ...prev, loading: false }));
      if (response.success) {
        notificationService.notify({
          variant: 'success',
          message: 'Successfully received improvement response',
          method: 'chat_gpt_improve',
        });
        setGptModal((prev) => ({ ...prev, response: response.data }));
      } else {
        notificationService.notify({
          variant: 'error',
          message: 'Could not received improvement response',
          method: 'chat_gpt_improve',
        });
      }
    });
  };

  const handleSyncQuery = () => {
    const collection = workspace?.collections?.find(
      (x) => x.id === currentSelectedQueryData?.collectionId
    );
    const folder = collection?.folders?.find(
      (x) => x.id === currentSelectedQueryData?.folderId
    );
    const query = folder?.queries?.find(
      (x) => x.id === currentSelectedQueryData?.id
    );
    if (query) setCurrentSelectedQueryData(query);
  };

  const disabledQueryActionButtons = currentSelectedQueryData === undefined;

  const hasCronJobConfigured =
    currentSelectedQueryData && currentSelectedQueryData?.cronJob !== null;

  return (
    <>
      <StyledEditorPanelActions className={cls.wrapper}>
        <Tooltip title={'Execute query'}>
          <StyledActionIconButton
            onClick={() => handleRunQuery(false)}
            variant={'success'}
          >
            <PlayCircleFilledIcon />
          </StyledActionIconButton>
        </Tooltip>
        <Tooltip title={'Execute query (AI enhanced)'}>
          <StyledActionIconButton
            onClick={() => handleRunQuery(true)}
            variant={'success'}
          >
            <PsychologyIcon />
          </StyledActionIconButton>
        </Tooltip>
        <Tooltip onClick={handleFormatQuery} title={'Format query'}>
          <StyledActionIconButton variant={'info'}>
            <LocalFloristOutlinedIcon />
          </StyledActionIconButton>
        </Tooltip>
        <Tooltip
          onClick={() =>
            setCronJobModal(
              produce((draft) => {
                draft.open = true;
              })
            )
          }
          title={'Scheduler'}
        >
          <span>
            <StyledActionIconButton
              disabled={disabledQueryActionButtons}
              variant={'info'}
            >
              <UpdateIcon />
            </StyledActionIconButton>
          </span>
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
        <Tooltip onClose={handleSyncQuery} title={'Pull updates'}>
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
        <Tooltip
          onClick={() => setGptModal((prev) => ({ ...prev, open: true }))}
          title={'Ask ChatGPT'}
        >
          <span>
            <StyledActionIconButton
              disabled={disabledQueryActionButtons}
              variant={'info'}
            >
              <PsychologyAltIcon />
            </StyledActionIconButton>
          </span>
        </Tooltip>
      </StyledEditorPanelActions>

      <Dialog
        open={gptModal.open}
        fullWidth
        maxWidth={'sm'}
        onClose={() => setGptModal(chatGPTModalDefaultState)}
      >
        <DialogTitle>AI Hype Train</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Typography color={blueGrey.A200} variant={'caption'}>
            Ask ChatGPT how to improve current query, it may (or may not)
            generate some useful hits for your!
          </Typography>

          {!_.isEmpty(gptModal.response) && (
            <>
              <br />
              <Divider />
              <Typography>Response</Typography>

              {gptModal.response.map((x) => (
                <Typography key={x} color={blueGrey.A100} variant={'caption'}>
                  {x}
                </Typography>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={gptModal.loading}
            onClick={handleChatGPTImproveRequest}
            variant={'contained'}
          >
            Ask
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={cronJobModal.open}
        fullWidth
        maxWidth={'xs'}
        onClose={() => setCronJobModal({ ...cronJobModalDefaultState })}
      >
        <DialogTitle>Cron job</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <TextField
            autoFocus
            required
            disabled={currentSelectedQueryData?.cronJob !== null}
            value={
              hasCronJobConfigured
                ? currentSelectedQueryData!.cronJob!.cronExpresion
                : cronJobModal.expression
            }
            onChange={(e) =>
              setCronJobModal(
                produce((draft) => {
                  draft.expression = e.target.value;
                })
              )
            }
            placeholder={`Cron expression (e.g.: 0 15 10 ? * *)`}
            autoComplete={'off'}
          />
          <Select
            value={
              hasCronJobConfigured
                ? currentSelectedQueryData!.cronJob!.emailList.split(';')
                : cronJobModal.collaborators
            }
            disabled={hasCronJobConfigured}
            multiple
            onChange={handleCronJobCollaboratorsChange}
            displayEmpty
            size={'small'}
            renderValue={(selected) => {
              if (_.isEmpty(selected)) {
                return (
                  <Typography variant={'body1'} fontStyle={'italic'}>
                    Collaborators
                  </Typography>
                );
              }
              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              );
            }}
          >
            {workspace?.collaborators?.map((x) => (
              <MenuItem key={x.email} value={x.email}>
                {x.email}
              </MenuItem>
            ))}
          </Select>
          <Typography color={blueGrey.A200} variant={'caption'}>
            When cron job will be triggered (based on cron expression), the
            current query will be executed and results will be sent to the
            selected collaborators emails (in .csv format)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRemoveCronJob}
            disabled={!hasCronJobConfigured}
            color={'error'}
          >
            Delete
          </Button>
          <Button
            onClick={handleSetupCronJob}
            variant={'contained'}
            disabled={hasCronJobConfigured}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
