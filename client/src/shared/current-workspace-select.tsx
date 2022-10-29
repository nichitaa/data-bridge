import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { allWorkspacesAtom } from '../recoil/atoms';

const CurrentWorkspaceSelect = () => {
  const allWorkspaces = useRecoilValue(allWorkspacesAtom);
  const navigate = useNavigate();
  const [currentWorkspace, setCurrentWorkspace] = useState(allWorkspaces[0].id);

  const handleOnChange = (event: SelectChangeEvent) => {
    const workspaceName = event.target.value as string;
    setCurrentWorkspace(workspaceName);
    navigate(`/workspace/${workspaceName}`);
  };

  return (
    <Select value={currentWorkspace} onChange={handleOnChange} size={'small'}>
      {allWorkspaces.map((w) => (
        <MenuItem key={w.id} value={w.id}>
          {w.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CurrentWorkspaceSelect;
