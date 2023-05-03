import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  allWorkspacesAtom,
  currentWorkspaceInfoAtom,
  jwtAtom,
  workspaceChannelAtom,
} from '../../recoil/atoms';
import { dbService, mainService, notificationService } from '../../services';
import { LoadingButton } from '@mui/lab';

interface WorkspaceDialog {
  dialogProps: DialogProps;
  type: 'edit' | 'create';
}

const WorkspaceDialog = (props: WorkspaceDialog) => {
  const { dialogProps, type } = props;
  const jwt = useRecoilValue(jwtAtom);
  const currentWorkspaceInfo = useRecoilValue(currentWorkspaceInfoAtom);
  const setAllWorkspaces = useSetRecoilState(allWorkspacesAtom);
  const channel = useRecoilValue(workspaceChannelAtom);

  const [loading, setLoading] = useState(false);
  const [workspaceInfoForm, setWorkspaceInfoForm] = useState({
    name: '',
    dataBaseType: 0,
    dbConnectionString: '',
    envVariables: '',
  });

  useEffect(() => {
    if (type === 'edit' && currentWorkspaceInfo !== undefined) {
      setWorkspaceInfoForm({
        name: currentWorkspaceInfo?.name,
        dbConnectionString: currentWorkspaceInfo?.dbConnectionString,
        envVariables: currentWorkspaceInfo?.envVariables ?? '',
        dataBaseType: currentWorkspaceInfo.dataBaseType,
      });
    }
  }, [type, currentWorkspaceInfo]);

  const handleOnClose: DialogProps['onClose'] = (event, reason) => {
    // discard changes
    if (type === 'edit') {
      setWorkspaceInfoForm({
        name: currentWorkspaceInfo?.name!,
        dbConnectionString: currentWorkspaceInfo?.dbConnectionString!,
        envVariables: currentWorkspaceInfo?.envVariables ?? '',
        dataBaseType: currentWorkspaceInfo?.dataBaseType!,
      });
    } else {
      setWorkspaceInfoForm({
        name: '',
        dbConnectionString: '',
        envVariables: '',
        dataBaseType: 0,
      });
    }
    dialogProps?.onClose?.(event, reason);
  };

  const handleOnFieldChange = (
    field: keyof typeof workspaceInfoForm,
    value: string
  ) => {
    setWorkspaceInfoForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    const request = {
      connectionString: workspaceInfoForm.dbConnectionString!,
      dataBaseType: workspaceInfoForm.dataBaseType,
    };
    setLoading(true);
    const response = await dbService.testConnection(jwt!, request);
    if (response.success) {
      notificationService.notify({
        variant: 'success',
        method: 'test_connection',
        message: 'Connection is valid!',
      });
    } else {
      notificationService.notify({
        variant: 'error',
        method: 'test_connection',
        message: 'Could not connect, invalid connection!',
      });
    }
    setLoading(false);
    return response.success;
  };

  const validateWorkspace = async () => {
    const requiredFields = ['name', 'connectionString'];
    let isValid = true;
    for (const field of requiredFields) {
      if (workspaceInfoForm[field] === '') {
        notificationService.notify({
          variant: 'error',
          method: 'create-wp',
          message: `${field} field is required!`,
        });
        isValid = false;
        break;
      }
    }
    const connectionValid = await handleTestConnection();
    return !(!isValid || !connectionValid);
  };

  const reFetchAllWorkspaces = async () => {
    const allWpsResponse = await mainService.listWorkspaces(jwt!);
    if (allWpsResponse.success) {
      setAllWorkspaces(allWpsResponse.data);
    }
  };

  const handleCreateWorkspace = async () => {
    const isValid = await validateWorkspace();
    if (!isValid) return;
    setLoading(true);
    const response = await mainService.createWorkspace(jwt!, workspaceInfoForm);
    if (response.success) {
      notificationService.notify({
        variant: 'success',
        method: 'create-wp',
        message: `Workspace created!`,
      });
      await reFetchAllWorkspaces();
      dialogProps?.onClose?.({}, 'escapeKeyDown');
    } else {
      notificationService.notify({
        variant: 'error',
        method: 'create-wp',
        message: `Could not create a workspace!`,
      });
    }
    setLoading(false);
  };
  const handleSaveWorkspace = async () => {
    const isValid = await validateWorkspace();
    if (!isValid) return;
    setLoading(true);
    channel
      ?.push('update_workspace', workspaceInfoForm)
      .receive('ok', async (response) => {
        if (response.success) {
          notificationService.notify({
            message: 'Workspace updated!',
            variant: 'success',
            method: 'update_workspace',
          });
          await reFetchAllWorkspaces();
          dialogProps?.onClose?.({}, 'escapeKeyDown');
        } else {
          notificationService.notify({
            message:
              typeof response.error === 'string'
                ? response.error
                : 'Could not update workspace!',
            variant: 'error',
            method: 'update_workspace',
          });
        }
      });
    setLoading(false);
  };

  return (
    <Dialog {...dialogProps} onClose={handleOnClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>
        {type === 'create' ? 'Create new workspace' : 'Edit workspace'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Note! Test your connection before creating a new workspace
        </DialogContentText>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            autoComplete={'off'}
            value={workspaceInfoForm.name}
            onChange={(e) => handleOnFieldChange('name', e.target.value)}
            placeholder={'workspace name'}
            autoFocus
            fullWidth
          />
          <Select
            value={workspaceInfoForm.dataBaseType}
            onChange={(e) => {
              handleOnFieldChange('dataBaseType', e.target.value as string);
            }}
            placeholder={'Database type'}
            size={'small'}
          >
            <MenuItem key={'MySQL'} value={0}>
              MySQL
            </MenuItem>
            <MenuItem key={'Postgres'} value={1}>
              Postgres
            </MenuItem>
            <MenuItem key={'SQLite'} value={2}>
              SQLite
            </MenuItem>
            <MenuItem key={'Oracle'} value={3}>
              Oracle
            </MenuItem>
            <MenuItem key={'MSSQL'} value={4}>
              MS SQL
            </MenuItem>
          </Select>
          <TextField
            autoComplete={'off'}
            value={workspaceInfoForm.dbConnectionString}
            onChange={(e) =>
              handleOnFieldChange('dbConnectionString', e.target.value)
            }
            placeholder={'connection string'}
            fullWidth
          />
          <TextField
            autoComplete={'off'}
            value={workspaceInfoForm.envVariables}
            onChange={(e) =>
              handleOnFieldChange('envVariables', e.target.value)
            }
            placeholder={'environment values e.g.: VAR1=hello;VAR2=world'}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          loading={loading}
          onClick={handleTestConnection}
          color={'info'}
        >
          Test connection
        </LoadingButton>
        <LoadingButton
          loading={loading}
          onClick={
            type === 'create' ? handleCreateWorkspace : handleSaveWorkspace
          }
          color={'warning'}
        >
          {type === 'create' ? 'Create' : 'Save'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default WorkspaceDialog;
