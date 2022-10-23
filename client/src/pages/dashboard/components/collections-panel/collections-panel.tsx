import {
  alpha,
  Box,
  BoxProps,
  generateUtilityClasses,
  IconButton,
  styled,
  svgIconClasses,
  Tooltip,
  useTheme,
} from '@mui/material';
import { usePanelResize } from '../../../../hooks/use-panel-resize';
import {
  collectionsPanelMaxSizeAtom,
  collectionsPanelMinSizeAtom,
  collectionsPanelSizeAtom,
} from '../../../../recoil/atoms';
import Tree, { useTreeState } from 'react-hyper-tree';
import { useCallback } from 'react';
import { HyperTreeViewMainProps } from 'react-hyper-tree/dist/types';
import CollectionTreeNode from './tree-nodes/collection-tree-node';
import FolderTreeNode from './tree-nodes/folder-tree-node';
import QueryTreeNode from './tree-nodes/query-tree-node';
import ActionBar from './action-bar';
import SettingsEthernetOutlinedIcon from '@mui/icons-material/SettingsEthernetOutlined';

const data = [
  {
    id: 1,
    collection: 'collection Name',
    children: [
      {
        id: 2,
        folder: 'folder Name',
        children: [
          {
            id: 3,
            query: 'query 1__1',
          },
          {
            id: 4,
            query: 'query 1__2',
          },
          {
            id: 5,
            query: 'query 1__3',
          },
        ],
      },
      {
        id: 6,
        folder: 'folder Name 2',
        children: [
          {
            id: 7,
            query: 'query 1__1',
          },
          {
            id: 8,
            query: 'query 1__2',
          },
          {
            id: 9,
            query: 'query 1__3',
          },
        ],
      },
    ],
  },
  {
    id: 10,
    collection: 'collection Name1',
    children: [
      {
        id: 11,
        folder: 'folder Name1',
        children: [
          {
            id: 12,
            query: 'query 2__1',
          },
          {
            id: 13,
            query: 'query 2__2',
          },
          {
            id: 14,
            query: 'query 2__3',
          },
        ],
      },
    ],
  },
];

interface MainProps {
  dimensions: { height: number; width: number };
}

const collectionPanelClasses = generateUtilityClasses('CollectionsPanel', [
  'selectedQuery',
]);
const cls = collectionPanelClasses;

const CollectionsPanel = (props: MainProps) => {
  const theme = useTheme();
  const { maximizePanel } = usePanelResize({
    minSizeAtom: collectionsPanelMinSizeAtom,
    maxSizeAtom: collectionsPanelMaxSizeAtom,
    sizeAtom: collectionsPanelSizeAtom,
  });
  const { required, handlers, instance } = useTreeState({
    data,
    id: 'collections',
    multipleSelect: false,
    defaultOpened: true,
    idKey: 'id',
    childrenKey: 'children',
  });

  const handleMaximizePanel = () => maximizePanel(300);

  const renderNode: HyperTreeViewMainProps['renderNode'] = useCallback(
    ({ node, ...otherNodeProps }) => {
      const isCollection = node.data.collection;
      const isFolder = node.data.folder;
      const isQuery = node.data.query;
      if (isCollection)
        return <CollectionTreeNode node={node} {...otherNodeProps} />;
      if (isFolder) return <FolderTreeNode node={node} {...otherNodeProps} />;
      if (isQuery) return <QueryTreeNode node={node} {...otherNodeProps} />;
      else throw new Error('not collection | folder | query node');
    },
    []
  );

  if (props.dimensions.width <= 35) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: '4px' }}>
        <Tooltip title={'Expand collections panel'}>
          <StyledExpandPanelIconButton
            size={'small'}
            onClick={handleMaximizePanel}
          >
            <SettingsEthernetOutlinedIcon />
          </StyledExpandPanelIconButton>
        </Tooltip>
      </Box>
    );
  }
  return (
    <StyledCollectionPanel>
      <ActionBar />
      <Tree
        {...required}
        {...handlers}
        classes={{
          selectedNodeWrapper: cls.selectedQuery,
        }}
        draggable={false}
        horizontalLineStyles={{
          stroke: theme.palette.primary.main,
          strokeWidth: 1,
          strokeDasharray: '1 4',
        }}
        verticalLineStyles={{
          stroke: theme.palette.primary.main,
          strokeWidth: 1,
        }}
        // verticalLineOffset={5}
        // verticalLineTopOffset={-2}
        renderNode={renderNode}
      />
    </StyledCollectionPanel>
  );
};

export const StyledExpandPanelIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 4,
  padding: 2,
  backgroundColor: alpha(theme.palette.info.main, 0.2),
  color: theme.palette.info.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.info.main, 0.3),
  },
  [`& .${svgIconClasses.root}`]: {
    fontSize: 18,
  },
}));

const StyledCollectionPanel = styled(Box)<BoxProps>(({ theme }) => ({
  padding: 8,
  height: '100%',
  minWidth: 250,
  [`& .${cls.selectedQuery}`]: {
    borderRadius: 3,
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

export default CollectionsPanel;
