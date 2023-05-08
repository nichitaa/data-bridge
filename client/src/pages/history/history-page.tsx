import {
  Avatar,
  Box,
  Divider,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useRecoilValue } from 'recoil';
import { currentWorkspaceInfoAtom } from '../../recoil/atoms';
import { blueGrey, teal } from '@mui/material/colors';

const HistoryPage = () => {
  const workspace = useRecoilValue(currentWorkspaceInfoAtom);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant={'h5'}>Activity</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Filter by </Typography>
          <Select
            value={''}
            onChange={(e) => {
              console.log(e.target.value);
            }}
            displayEmpty
            size={'small'}
            renderValue={(selected) => {
              if (_.isEmpty(selected)) {
                return (
                  <Typography variant={'body1'} fontStyle={'italic'}>
                    Collaborator
                  </Typography>
                );
              }
              return selected;
            }}
          >
            {workspace?.collaborators?.map((x) => (
              <MenuItem key={x.email} value={x.email}>
                {x.email}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={''}
            onChange={(e) => {
              console.log(e.target.value);
            }}
            displayEmpty
            size={'small'}
            renderValue={(selected) => {
              if (_.isEmpty(selected)) {
                return (
                  <Typography variant={'body1'} fontStyle={'italic'}>
                    Action type
                  </Typography>
                );
              }
              return selected;
            }}
          >
            <MenuItem key={'created'} value={'created'}>
              created
            </MenuItem>
            <MenuItem key={'renamed'} value={'renamed'}>
              renamed
            </MenuItem>
            <MenuItem key={'edited'} value={'edited'}>
              edited
            </MenuItem>
            <MenuItem key={'deleted'} value={'deleted'}>
              deleted
            </MenuItem>
          </Select>
          <Select
            value={''}
            onChange={(e) => {
              console.log(e.target.value);
            }}
            displayEmpty
            size={'small'}
            renderValue={(selected) => {
              if (_.isEmpty(selected)) {
                return (
                  <Typography variant={'body1'} fontStyle={'italic'}>
                    Resource
                  </Typography>
                );
              }
              return selected;
            }}
          >
            <MenuItem key={'collection'} value={'collection'}>
              collection
            </MenuItem>
            <MenuItem key={'folder'} value={'folder'}>
              folder
            </MenuItem>
            <MenuItem key={'query'} value={'query'}>
              query
            </MenuItem>
          </Select>
        </Box>
      </Box>
      <Divider />
      <Box sx={{ pt: 2 }}>
        <Typography color={blueGrey.A100}>May 3, 2023</Typography>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>created the</Typography>
            <Typography>CollectionName</Typography>
            <Typography color={blueGrey.A200}>collection</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>edited the</Typography>
            <Typography>QueryName</Typography>
            <Typography color={blueGrey.A200}>query</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
      </Box>
      <Box sx={{ pt: 2 }}>
        <Typography color={blueGrey.A100}>May 4, 2023</Typography>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>created the</Typography>
            <Typography>CollectionName</Typography>
            <Typography color={blueGrey.A200}>collection</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>edited the</Typography>
            <Typography>QueryName</Typography>
            <Typography color={blueGrey.A200}>query</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>edited the</Typography>
            <Typography>QueryName</Typography>
            <Typography color={blueGrey.A200}>query</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>edited the</Typography>
            <Typography>QueryName</Typography>
            <Typography color={blueGrey.A200}>query</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>edited the</Typography>
            <Typography>QueryName</Typography>
            <Typography color={blueGrey.A200}>query</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
        <Box sx={{ pl: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Avatar
              key={'S'}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              S
            </Avatar>
            <Typography>Sam</Typography>
            <Typography color={blueGrey.A200}>edited the</Typography>
            <Typography>QueryName</Typography>
            <Typography color={blueGrey.A200}>query</Typography>
          </Box>
          <Typography color={blueGrey.A100}>8:40PM</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HistoryPage;
