import { DefaultNodeProps } from 'react-hyper-tree/dist/types';
import { Box } from '@mui/material';
import { StyledNodeTypography, StyledTreeNode } from './collection-tree-node';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { currentSelectedQueryDataAtom } from '../../../../../recoil/atoms';

interface MainProps extends DefaultNodeProps {}

const QueryTreeNode = (props: MainProps) => {
  const { node, onSelect } = props;

  const currentSelectedQuery = useRecoilValue(currentSelectedQueryDataAtom);

  // keep current selected query node
  useEffect(() => {
    if (currentSelectedQuery?.id === node.data.id) {
      if (!node.options.selected) {
        node.setSelected(true);
      }
    }
  }, [node, currentSelectedQuery]);

  return (
    <StyledTreeNode key={`${node.data.id}_${node.data.query}`} type={'query'}>
      <Box className={'labelWrapper'} onClick={(e) => onSelect(e)}>
        <StyledNodeTypography component={'div'}>
          {node.data.query}
        </StyledNodeTypography>
      </Box>
    </StyledTreeNode>
  );
};

export default QueryTreeNode;
