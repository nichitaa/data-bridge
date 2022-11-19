import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  allWorkspacesAtom,
  currentWorkspaceInfoAtom,
  jwtAtom,
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

  const [loading, setLoading] = useState(false);
  const [workspaceInfoForm, setWorkspaceInfoForm] = useState({
    name: '',
    dbConnectionString: '',
    envVariables: '',
    documentation: 'documentation for you workspace',
  });

  useEffect(() => {
    if (type === 'edit' && currentWorkspaceInfo !== undefined) {
      setWorkspaceInfoForm({
        name: currentWorkspaceInfo?.name,
        dbConnectionString: currentWorkspaceInfo?.dbConnectionString,
        envVariables: currentWorkspaceInfo?.envVariables ?? '',
        documentation: currentWorkspaceInfo?.documentation,
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
        documentation: currentWorkspaceInfo?.documentation!,
      });
    } else {
      setWorkspaceInfoForm({
        name: '',
        dbConnectionString: '',
        envVariables: '',
        documentation: 'documentation for you workspace',
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
      dataBaseType: 1, // pg
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
    const updateResponse = await mainService.updateWorkspace(
      jwt!,
      currentWorkspaceInfo?.id!,
      workspaceInfoForm
    );
    if (updateResponse.success) {
      notificationService.notify({
        variant: 'success',
        message: 'Successfully updated workspace!',
        method: 'update-wp',
      });
      await reFetchAllWorkspaces();
      dialogProps?.onClose?.({}, 'escapeKeyDown');
    } else {
      notificationService.notify({
        variant: 'error',
        method: 'update-wp',
        message: `Could not update workspace!`,
      });
    }
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
          <TextField
            autoComplete={'off'}
            value={workspaceInfoForm.dbConnectionString}
            onChange={(e) =>
              handleOnFieldChange('dbConnectionString', e.target.value)
            }
            placeholder={'connection string'}
            autoFocus
            fullWidth
          />
          <TextField
            autoComplete={'off'}
            value={workspaceInfoForm.envVariables}
            onChange={(e) =>
              handleOnFieldChange('envVariables', e.target.value)
            }
            placeholder={'environment values e.g.: VAR1=hello;VAR2=world'}
            autoFocus
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
