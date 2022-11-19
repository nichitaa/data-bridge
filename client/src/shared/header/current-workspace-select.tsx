import {
  menuClasses,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { allWorkspacesAtom } from '../../recoil/atoms';

const CurrentWorkspaceSelect = () => {
  const allWorkspaces = useRecoilValue(allWorkspacesAtom);
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const handleOnChange = (event: SelectChangeEvent) => {
    const workspaceName = event.target.value as string;
    navigate(`/workspace/${workspaceName}`);
  };

  if (allWorkspaces?.length === 0) return <>No workspaces</>;
  return (
    <Select
      value={workspaceId ?? ''}
      onChange={handleOnChange}
      size={'small'}
      MenuProps={{
        PaperProps: {
          sx: {
            [`& .${menuClasses.list}`]: {
              paddingTop: 0,
              paddingBottom: 0,
            },
          },
        },
      }}
    >
      {allWorkspaces?.map((w) => (
        <MenuItem key={w.id} value={w.id}>
          {w.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default CurrentWorkspaceSelect;
