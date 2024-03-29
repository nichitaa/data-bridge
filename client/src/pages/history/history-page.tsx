import {
  Avatar,
  Box,
  Divider,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useRecoilValue } from 'recoil';
import {
  currentWorkspaceInfoAtom,
  workspaceChannelAtom,
} from '../../recoil/atoms';
import { blueGrey, teal } from '@mui/material/colors';
import { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import RestoreIcon from '@mui/icons-material/Restore';
import { produce } from 'immer';
import { StyledActionIconButton } from '../workspace/components/editor-panel/editor-panel-actions';
import { notificationService } from '../../services';

const HistoryPage = () => {
  const workspace = useRecoilValue(currentWorkspaceInfoAtom);
  const [filters, setFilters] = useState({
    collaborator: '',
    actionType: '',
    resource: '',
  });
  const channel = useRecoilValue(workspaceChannelAtom);

  const history = _(workspace?.activityHistories ?? [])
    .orderBy((x) => Number(x.actionPerformedTime), 'desc')
    .filter((x) =>
      !_.isEmpty(filters.collaborator)
        ? x.userName === filters.collaborator
        : true
    )
    .filter((x) =>
      !_.isEmpty(filters.actionType) ? x.action === filters.actionType : true
    )
    .filter((x) =>
      !_.isEmpty(filters.resource) ? x.entityType === filters.resource : true
    )
    .map((x) => ({
      ...x,
      day: dayjs.unix(Number(x.actionPerformedTime)).format('MMM D, YYYY'),
      time: dayjs.unix(Number(x.actionPerformedTime)).format('hh:mmA'),
    }))
    .groupBy((x) => x.day)
    .toPairs()
    .sortBy(([_, items]) => Number(items[0].actionPerformedTime))
    .fromPairs()
    .value();

  const handleRollbackToPreviousQueryVersion = (queryId, version) => {
    const request = { queryId, version };
    channel?.push('apply_query_version', request).receive('ok', (response) => {
      if (response.success) {
        notificationService.notify({
          variant: 'success',
          message: response.message,
          method: 'apply_query_version',
        });
      } else {
        notificationService.notify({
          variant: 'error',
          message: 'Could not rollback to previous query version',
          method: 'apply_query_version',
        });
      }
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant={'h5'}>Activity</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Filter by </Typography>
          <Select
            value={filters.collaborator}
            onChange={(e) => {
              setFilters(
                produce((draft) => {
                  draft.collaborator = e.target.value;
                })
              );
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
            <MenuItem key={'all'} value={''}>
              <em>all</em>
            </MenuItem>
            {workspace?.collaborators?.map((x) => (
              <MenuItem key={x.email} value={x.email}>
                {x.email}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={filters.actionType}
            onChange={(e) => {
              setFilters(
                produce((draft) => {
                  draft.actionType = e.target.value;
                })
              );
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
            <MenuItem key={'all'} value={''}>
              <em>all</em>
            </MenuItem>
            <MenuItem key={'created'} value={'created'}>
              created
            </MenuItem>
            <MenuItem key={'renamed'} value={'renamed'}>
              renamed
            </MenuItem>
            <MenuItem key={'applied'} value={'applied'}>
              applied
            </MenuItem>
            <MenuItem key={'edited'} value={'edited'}>
              edited
            </MenuItem>
            <MenuItem key={'deleted'} value={'deleted'}>
              deleted
            </MenuItem>
            <MenuItem key={'joined'} value={'joined'}>
              joined
            </MenuItem>
            <MenuItem key={'invited'} value={'invited'}>
              invited
            </MenuItem>
          </Select>
          <Select
            value={filters.resource}
            onChange={(e) => {
              setFilters(
                produce((draft) => {
                  draft.resource = e.target.value;
                })
              );
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
            <MenuItem key={'all'} value={''}>
              <em>all</em>
            </MenuItem>
            <MenuItem key={'collection'} value={'collection'}>
              collection
            </MenuItem>
            <MenuItem key={'folder'} value={'folder'}>
              folder
            </MenuItem>
            <MenuItem key={'query'} value={'query'}>
              query
            </MenuItem>
            <MenuItem key={'queryVersion'} value={'queryVersion'}>
              query version
            </MenuItem>
            <MenuItem key={'workspace'} value={'workspace'}>
              workspace
            </MenuItem>
            <MenuItem key={'user'} value={'user'}>
              user
            </MenuItem>
          </Select>
        </Box>
      </Box>
      <Divider />

      {Object.keys(history).map((date) => {
        return (
          <Box sx={{ pt: 2 }} key={date}>
            <Typography color={blueGrey.A100}>{date}</Typography>
            {history[date].map((el) => {
              return (
                <Fragment key={el.actionPerformedTime + el.action}>
                  <Box sx={{ pl: 3, pt: 1 }}>
                    <Box
                      sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}
                    >
                      <Avatar
                        key={'S'}
                        sx={{
                          maxWidth: 24,
                          height: 24,
                          backgroundColor: teal[500],
                        }}
                      >
                        {el.userName[0]}
                      </Avatar>
                      <Typography>{el.userName}</Typography>
                      <Typography color={blueGrey.A200}>
                        {el.action} the
                      </Typography>
                      <Typography>{el.entityName}</Typography>
                      {el.entityType === 'queryVersion' ? (
                        <>
                          <Typography color={blueGrey.A200}>version</Typography>
                          <Typography color={blueGrey.A200}>
                            , for the
                          </Typography>
                          <Typography>
                            {JSON.parse(el.metadata).queryName}
                          </Typography>
                          <Typography color={blueGrey.A200}>query</Typography>

                          {el.action === 'created' && (
                            <Tooltip
                              onClick={() => {
                                const parsed = JSON.parse(el.metadata);
                                handleRollbackToPreviousQueryVersion(
                                  parsed.queryId,
                                  el.entityName
                                );
                              }}
                              title={'Rollback to this version'}
                            >
                              <span>
                                <StyledActionIconButton variant={'warning'}>
                                  <RestoreIcon />
                                </StyledActionIconButton>
                              </span>
                            </Tooltip>
                          )}
                        </>
                      ) : (
                        <Typography color={blueGrey.A200}>
                          {el.entityType}
                        </Typography>
                      )}
                    </Box>
                    <Typography color={blueGrey.A100}>{el.time}</Typography>
                  </Box>
                </Fragment>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
};

export default HistoryPage;
