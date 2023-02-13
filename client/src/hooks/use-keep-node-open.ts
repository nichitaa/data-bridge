import { useEffect } from 'react';
import { treeHandlers } from 'react-hyper-tree';
import { useRecoilValue } from 'recoil';
import { openedNodePathsAtom } from '../recoil/atoms';
import { DefaultNodeProps } from 'react-hyper-tree/dist/types';

export const useKeepNodeOpen = (node: DefaultNodeProps['node']) => {
  const openedNodePaths = useRecoilValue(openedNodePathsAtom);

  useEffect(() => {
    const wasOpen = openedNodePaths.find((p) => p === node.options.path);
    if (wasOpen !== undefined) {
      treeHandlers.trees.collections.handlers.setOpen(node, true);
    }
  }, [node]);
};
