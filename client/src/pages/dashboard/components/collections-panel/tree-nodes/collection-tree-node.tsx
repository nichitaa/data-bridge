import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { treeHandlers } from 'react-hyper-tree';
import {
  alpha,
  Box,
  BoxProps,
  darken,
  IconButton,
  IconButtonProps,
  Menu,
  menuClasses,
  MenuItem,
  menuItemClasses,
  MenuProps,
  styled,
  svgIconClasses,
  Typography,
  typographyClasses,
  TypographyProps,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { MouseEvent, MouseEventHandler, useState } from 'react';

interface MainProps extends DefaultNodeProps {}

const CollectionTreeNode = (props: MainProps) => {
  const { node } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
    <StyledTreeNode
      key={`${node.data.id}_${node.data.collection}`}
      type={'collection'}
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
          {node.data.collection} <code>[f={node.data.children.length}]</code>
        </StyledNodeTypography>
      </Box>
      <StyledNodeIconButton onClick={handleMenuOpen}>
        <MoreHorizIcon />
      </StyledNodeIconButton>
      <StyledTreeNodeMenu
        type={'collection'}
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
          <Typography component={'div'}>Add folder</Typography>
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
  );
};

/** ######################## Styled ######################## */

interface StyledTreeNodeMenuProps extends MenuProps {
  type?: 'collection' | 'query' | 'folder';
}

export const StyledTreeNodeMenu = styled(Menu, {
  shouldForwardProp: (prop) => !['type'].includes(prop as string),
})<StyledTreeNodeMenuProps>(({ theme, type }) => ({
  [`& .${menuClasses.list}`]: {
    padding: 0,
    [`& .${menuItemClasses.root}`]: {
      padding: 6,
      [`& .${typographyClasses.root}`]: {
        fontSize: 12,
        textAlign: 'center',
      },
    },
  },
  [`& .${menuClasses.paper}`]: {
    ...(type === 'collection'
      ? {
          border: `1px solid ${alpha(theme.palette.warning.main, 0.5)}`,
        }
      : type === 'folder'
      ? {
          border: `1px solid ${alpha(theme.palette.info.main, 0.5)}`,
        }
      : type === 'query'
      ? {
          border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
        }
      : {}),
  },
}));

interface StyledTreeNodeProps extends BoxProps {
  type?: 'collection' | 'query' | 'folder';
}

export const StyledTreeNode = styled(Box, {
  shouldForwardProp: (prop) => !['type'].includes(prop as string),
})<StyledTreeNodeProps>(({ theme, type }) => ({
  paddingLeft: 5,
  paddingRight: 5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: 'fit-content',
  borderRadius: 3,
  [`& .labelWrapper`]: {
    cursor: 'pointer',
    display: 'inline-flex',
    flexGrow: 1,
  },
  ...(type === 'collection'
    ? {
        marginTop: 8,
        border: `1px solid ${alpha(theme.palette.warning.main, 0.5)}`,
      }
    : type === 'folder'
    ? {
        marginTop: '2px',
        border: `1px solid ${alpha(theme.palette.info.main, 0.5)}`,
      }
    : type === 'query'
    ? {
        marginTop: '2px',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
      }
    : {}),
}));

export const StyledNodeTypography = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    marginLeft: '5px',
    fontSize: 14,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    '& code': {
      fontSize: 10,
      marginLeft: 10,
    },
  })
) as typeof Typography;

export const StyledNodeIconButton = styled(IconButton)<IconButtonProps>(
  ({ theme }) => ({
    padding: 2,
    borderRadius: 4,
    [`& .${svgIconClasses.root}`]: {
      fontSize: 16,
    },
  })
);

export default CollectionTreeNode;
