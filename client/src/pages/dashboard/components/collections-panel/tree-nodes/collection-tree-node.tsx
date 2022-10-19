import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { treeHandlers } from 'react-hyper-tree';
import {
  alpha,
  Box,
  BoxProps,
  IconButton,
  IconButtonProps,
  styled,
  svgIconClasses,
  Typography,
  TypographyProps,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { MouseEventHandler } from 'react';

interface MainProps extends DefaultNodeProps {}

const CollectionTreeNode = (props: MainProps) => {
  const { node } = props;
  const toggle: MouseEventHandler = (e) => {
    e.stopPropagation();
    treeHandlers.trees.collections.handlers.setOpen(node, !node.isSelected());
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
      {/*TODO: collections menu*/}
      <StyledNodeIconButton>
        <MoreHorizIcon />
      </StyledNodeIconButton>
    </StyledTreeNode>
  );
};

/** ######################## Styled ######################## */

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
