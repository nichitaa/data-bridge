import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { treeHandlers } from 'react-hyper-tree';
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
import { MouseEvent, MouseEventHandler, useState } from 'react';
import { notificationService } from '../../../../../services';
import { useRecoilValue } from 'recoil';
import { workspaceChannelAtom } from '../../../../../recoil/atoms';
import AddDialog from '../../add-dialog/add-dialog';

interface MainProps extends DefaultNodeProps {}

const FolderTreeNode = (props: MainProps) => {
  const { node } = props;
  const channel = useRecoilValue(workspaceChannelAtom);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddQueryDialog, setOpenAddQueryDialog] = useState(false);

  const handleAddQuery = (name: string, clearStateName: () => void) => {
    if (name.trim() === '') {
      return notificationService.notify({
        message: 'Name could not be empty',
        variant: 'error',
        method: 'create_query',
      });
    }
    const request = {
      collection_id: node.data.collectionId,
      folder_id: node.data.id,
      name: name,
      documentation: `### documentation for query ${name}!`,
      rawSql: `-- sql for query ${name}`,
    };
    channel?.push('create_query', request).receive('ok', (response) => {
      if (response.success) {
        notificationService.notify({
          message: 'Query created!',
          variant: 'success',
          method: 'create_query',
        });
        setOpenAddQueryDialog(false);
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

  const toggle: MouseEventHandler = (e) => {
    e.stopPropagation();
    treeHandlers.trees.collections.handlers.setOpen(node, !node.isSelected());
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
          <MenuItem onClick={() => setOpenAddQueryDialog(true)}>
            <Typography component={'div'}>Add query</Typography>
          </MenuItem>
          <MenuItem onClick={() => {}}>
            <Typography component={'div'}>Docs</Typography>
          </MenuItem>
          <MenuItem onClick={() => {}}>
            <Typography component={'div'}>Rename</Typography>
          </MenuItem>
          <MenuItem onClick={() => {}}>
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
        open={openAddQueryDialog}
        onClose={() => setOpenAddQueryDialog(false)}
      />
    </>
  );
};

export default FolderTreeNode;
