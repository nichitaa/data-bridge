import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { treeHandlers } from 'react-hyper-tree';
import { Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  StyledNodeIconButton,
  StyledNodeTypography,
  StyledTreeNode,
} from './collection-tree-node';
import { MouseEventHandler } from 'react';

interface MainProps extends DefaultNodeProps {}

const FolderTreeNode = (props: MainProps) => {
  const { node } = props;
  const toggle: MouseEventHandler = (e) => {
    e.stopPropagation();
    treeHandlers.trees.collections.handlers.setOpen(node, !node.isSelected());
  };
  return (
    <StyledTreeNode key={`${node.data.id}_${node.data.folder}`} type={'folder'}>
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
      {/*TODO: folder menu*/}
      <StyledNodeIconButton>
        <MoreHorizIcon />
      </StyledNodeIconButton>
    </StyledTreeNode>
  );
};

export default FolderTreeNode;
