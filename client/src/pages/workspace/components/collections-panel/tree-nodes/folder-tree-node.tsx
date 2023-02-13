import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { Box, MenuItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  StyledNodeIconButton,
  StyledNodeTypography,
  StyledTreeNode,
  StyledTreeNodeMenu,
} from './collection-tree-node';
import React, { MouseEvent, MouseEventHandler, useState } from 'react';
import { notificationService } from '../../../../../services';
import { useRecoilValue } from 'recoil';
import { workspaceChannelAtom } from '../../../../../recoil/atoms';
import AddDialog from '../../menu-dialog/add-dialog';
import { useKeepNodeOpen } from '../../../../../hooks/use-keep-node-open';
import RenameDialog from '../../menu-dialog/rename-dialog';

interface MainProps extends DefaultNodeProps {}

const FolderTreeNode = (props: MainProps) => {
  const { node } = props;
  useKeepNodeOpen(node);
  const channel = useRecoilValue(workspaceChannelAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [addQueryModalOpen, setAddQueryModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const folderId = node.data.id;
  const collectionId = node.data.collectionId;
  const folderName = node.data.name;

  const handleAddQuery = (name: string, clearStateName: () => void) => {
    if (name.trim() === '') {
      return notificationService.notify({
        message: 'Name could not be empty',
        variant: 'error',
        method: 'create_query',
      });
    }
    const request = {
      type: 'query',
      collectionId,
      folderId,
      name,
      documentation: `### documentation for query ${name}!`,
      rawSql: `-- sql comment for query ${name}`,
    };
    channel?.push('create_resource', request).receive('ok', (response) => {
      if (response.success) {
        notificationService.notify({
          message: 'Query created!',
          variant: 'success',
          method: 'create_query',
        });
        setAddQueryModalOpen(false);
        clearStateName();
        handleMenuClose();
      } else {
        notificationService.notify({
          message: 'Could not create query!',
          variant: 'error',
          method: 'create_query',
        });
      }
    });
  };

  const handleRenameFolder = (name: string) => {
    if (name.trim() === '') {
      return notificationService.notify({
        message: 'Name could not be empty',
        variant: 'error',
        method: 'rename_resource',
      });
    }
    channel
      ?.push('rename_resource', {
        name,
        id: folderId,
        collectionId,
        type: 'folder',
      })
      .receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            message: 'Folder renamed!',
            variant: 'success',
            method: 'rename_resource',
          });
          setRenameModalOpen(false);
          handleMenuClose();
        } else {
          notificationService.notify({
            message: 'Could not rename folder!',
            variant: 'error',
            method: 'rename_resource',
          });
        }
      });
  };

  const handleDeleteFolder = () => {
    channel
      ?.push('delete_resource', { id: folderId, collectionId, type: 'folder' })
      .receive('ok', (response) => {
        if (response.success) {
          notificationService.notify({
            message: 'Folder deleted!',
            variant: 'success',
            method: 'delete_resource',
          });
          handleMenuClose();
        } else {
          notificationService.notify({
            message: 'Could not delete folder!',
            variant: 'error',
            method: 'delete_resource',
          });
        }
      });
  };

  const toggle: MouseEventHandler = (e) => {
    props.onToggle(e as any);
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <StyledTreeNode
        key={`${node.data.id}_${node.data.folder}`}
        type={'folder'}
      >
        <Box className={'labelWrapper'} onClick={toggle}>
          {node.options.opened ? (
            <>
              <StyledNodeIconButton onClick={toggle}>
                <ExpandMoreIcon />
              </StyledNodeIconButton>
            </>
          ) : (
            <>
              <StyledNodeIconButton onClick={toggle}>
                <ExpandLessIcon />
              </StyledNodeIconButton>
            </>
          )}
          <StyledNodeTypography component={'div'}>
            {node.data.folder} <code>[q={node.data.children.length}]</code>
          </StyledNodeTypography>
        </Box>
        <StyledNodeIconButton onClick={handleMenuOpen}>
          <MoreHorizIcon />
        </StyledNodeIconButton>
        <StyledTreeNodeMenu
          type={'folder'}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => setAddQueryModalOpen(true)}>
            <Typography component={'div'}>Add query</Typography>
          </MenuItem>
          <MenuItem onClick={() => setRenameModalOpen(true)}>
            <Typography component={'div'}>Rename</Typography>
          </MenuItem>
          <MenuItem onClick={handleDeleteFolder}>
            <Typography
              component={'div'}
              sx={{
                color: (theme) => theme.palette.error.main,
              }}
            >
              Delete
            </Typography>
          </MenuItem>
        </StyledTreeNodeMenu>
      </StyledTreeNode>
      <AddDialog
        type={'query'}
        onSubmit={handleAddQuery}
        open={addQueryModalOpen}
        onClose={() => setAddQueryModalOpen(false)}
      />
      <RenameDialog
        type={'folder'}
        initialValue={folderName}
        onSubmit={handleRenameFolder}
        open={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
      />
    </>
  );
};

export default FolderTreeNode;
