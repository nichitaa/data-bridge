import { alpha, Box, BoxProps, generateUtilityClasses } from '@mui/material';
import {
  ReflexContainer,
  ReflexElement,
  ReflexHandle,
  ReflexSplitter,
} from 'react-reflex';
import QueryResultPanel from './components/query-result-panel/query-result-panel';
import DocumentationsPanel from './components/documentations-panel/documentations-panel';
import CollectionsPanel from './components/collections-panel/collections-panel';
import { usePanelResize } from '../../hooks/use-panel-resize';
import {
  collectionsPanelMaxSizeAtom,
  collectionsPanelMinSizeAtom,
  collectionsPanelSizeAtom,
  documentationPanelMaxSizeAtom,
  documentationPanelMinSizeAtom,
  documentationPanelSizeAtom,
} from '../../recoil/atoms';
import { styled } from '@mui/styles';
import EditorPanel from './components/editor-panel/editor-panel';
import EditorPanelHeader from './components/editor-panel/editor-panel-header';

const dashboardPageClasses = generateUtilityClasses('DashboardPage', [
  'horizontalHandler',
  'splitter',
]);

const cls = dashboardPageClasses;

const DashboardPage = () => {
  const {
    size: collectionsSize,
    min: collectionsMinSize,
    max: collectionsMaxSize,
    onStopResize: onStopCollectionsResize,
    onResize: onCollectionsResize,
  } = usePanelResize({
    sizeAtom: collectionsPanelSizeAtom,
    maxSizeAtom: collectionsPanelMaxSizeAtom,
    minSizeAtom: collectionsPanelMinSizeAtom,
  });
  const {
    size: documentationSize,
    min: documentationMinSize,
    max: documentationMaxSize,
    onStopResize: onStopDocumentationResize,
    onResize: onDocumentationResize,
  } = usePanelResize({
    sizeAtom: documentationPanelSizeAtom,
    maxSizeAtom: documentationPanelMaxSizeAtom,
    minSizeAtom: documentationPanelMinSizeAtom,
  });

  return (
    <StyledDashboardPage>
      <ReflexContainer orientation={'vertical'}>
        <ReflexElement
          propagateDimensions
          size={collectionsSize}
          minSize={collectionsMinSize}
          maxSize={collectionsMaxSize}
          onResize={onCollectionsResize}
          onStopResize={onStopCollectionsResize}
          propagateDimensionsRate={200}
          // for `size` prop
          direction={1}
        >
          {/* @ts-ignore `dimensions` props are injected by `propagateDimensions` prop */}
          <CollectionsPanel />
        </ReflexElement>

        <ReflexSplitter propagate className={cls.splitter} />

        <ReflexElement>
          <ReflexContainer orientation={'horizontal'}>
            <ReflexElement
              minSize={30}
              propagateDimensionsRate={200}
              propagateDimensions
            >
              <EditorPanelHeader />
              {/*@ts-ignore*/}
              <EditorPanel />
            </ReflexElement>
            <ReflexSplitter
              propagate
              className={cls.splitter}
              style={{ display: 'none' }}
            />

            <ReflexElement
              minSize={30}
              style={{ overflow: 'hidden' }}
              propagateDimensions
              propagateDimensionsRate={200}
            >
              <ReflexHandle className={cls.horizontalHandler}>
                Result Explorer
              </ReflexHandle>
              {/* @ts-ignore */}
              <QueryResultPanel />
            </ReflexElement>
          </ReflexContainer>
        </ReflexElement>

        <ReflexSplitter propagate className={cls.splitter} />
        <ReflexElement
          propagateDimensions
          size={documentationSize}
          minSize={documentationMinSize}
          maxSize={documentationMaxSize}
          onResize={onDocumentationResize}
          onStopResize={onStopDocumentationResize}
          propagateDimensionsRate={200}
          direction={-1}
        >
          {/*@ts-ignore*/}
          <DocumentationsPanel />
        </ReflexElement>
      </ReflexContainer>
    </StyledDashboardPage>
  );
};

const StyledDashboardPage = styled(Box)<BoxProps>(({ theme }) => ({
  height: `calc(100vh - 48px)`,
  [`& .${cls.horizontalHandler}`]: {
    cursor: 'row-resize!important',
    height: 30,
    display: 'flex',
    paddingLeft: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    border: `1px solid ${alpha('#fff', 0.1)}`,
  },
  [`& .${cls.splitter}`]: {
    width: '4px!important',
    border: '0px!important',
    background: '#181c31!important',
  },
}));

export default DashboardPage;
