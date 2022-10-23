import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { Box, MenuItem, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  StyledNodeIconButton,
  StyledNodeTypography,
  StyledTreeNode,
  StyledTreeNodeMenu,
} from './collection-tree-node';
import { useState, MouseEvent } from 'react';

interface MainProps extends DefaultNodeProps {}

const QueryTreeNode = (props: MainProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { node, onSelect } = props;

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledTreeNode key={`${node.data.id}_${node.data.query}`} type={'query'}>
      <Box className={'labelWrapper'} onClick={(e) => onSelect(e)}>
        <StyledNodeTypography component={'div'}>
          {node.data.query}
        </StyledNodeTypography>
      </Box>
      <StyledNodeIconButton onClick={handleMenuOpen}>
        <MoreHorizIcon />
      </StyledNodeIconButton>
      <StyledTreeNodeMenu
        type={'query'}
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
        <MenuItem onClick={() => {}}>
          <Typography component={'div'}>Run</Typography>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <Typography component={'div'}>Rename</Typography>
        </MenuItem>
        <MenuItem onClick={() => {}}>
          <Typography component={'div'}>Docs</Typography>
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
  );
};

export default QueryTreeNode;
