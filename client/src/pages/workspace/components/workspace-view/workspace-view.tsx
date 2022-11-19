import { usePanelResize } from '../../../../hooks/use-panel-resize';
import {
  collectionsPanelMaxSizeAtom,
  collectionsPanelMinSizeAtom,
  collectionsPanelSizeAtom,
  currentActiveUsersAtom,
  documentationPanelMaxSizeAtom,
  documentationPanelMinSizeAtom,
  documentationPanelSizeAtom,
  workspaceChannelAtom,
  currentWorkspaceInfoAtom,
} from '../../../../recoil/atoms';
import {
  ReflexContainer,
  ReflexElement,
  ReflexHandle,
  ReflexSplitter,
} from 'react-reflex';
import CollectionsPanel from '../collections-panel/collections-panel';
import EditorPanelHeader from '../editor-panel/editor-panel-header';
import EditorPanel from '../editor-panel/editor-panel';
import ResultPanelHeader from '../query-result-panel/result-panel-header';
import QueryResultPanel from '../query-result-panel/query-result-panel';
import DocumentationsPanel from '../documentations-panel/documentations-panel';
import { styled } from '@mui/styles';
import { alpha, Box, BoxProps, generateUtilityClasses } from '@mui/material';
import { useParams } from 'react-router-dom';
import { usePhoenixChannel } from '../../../../hooks/use-phoenix-channel';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { usePhxPresence } from '../../../../hooks/use-phx-presence';

const workspacePageClasses = generateUtilityClasses('WorkspacePage', [
  'horizontalHandler',
  'splitter',
]);

const cls = workspacePageClasses;

const WorkspaceView = () => {
  const { workspaceId } = useParams<{ workspaceId?: string }>();
  usePhoenixChannel({
    topic: `workspace`,
    subtopic: workspaceId,
    recoilAtom: workspaceChannelAtom,
  });
  const [workspaceInfo, setWorkspaceInfo] = useRecoilState(currentWorkspaceInfoAtom);
  const channel = useRecoilValue(workspaceChannelAtom);
  const setCurrentActiveUsers = useSetRecoilState(currentActiveUsersAtom);
  const { handlePresenceSync } = usePhxPresence(channel);

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

  /** subscribe to channel emissions */
  useEffect(() => {
    if (channel !== undefined) {
      console.log('channel changed and is: ', channel);
      // const subscriptionRef = channel.on('from_server', (payload) => {
      //   console.log('[from_server] received: ', payload);
      // });
      channel.on('workspace_info', (payload) => {
        if (payload.success) {
          console.log('wp_info: ', payload.data);
          setWorkspaceInfo(payload.data);
        }
      });

      // send message to channel
      // const pushInstance = channel.push('event_name', {});
      // pushInstance
      //   .receive('ok', (response) => {
      //     console.log('[event_name] push ok: ', response);
      //   })
      //   .receive('error', (response) => {
      //     console.log('[event_name] push error: ', response);
      //   });

      return () => {
        // clean up subscriptions refs
        channel.off('from_server');
      };
    }
  }, [channel]);

  /** currently active users on this workspace */
  useEffect(() => {
    handlePresenceSync((presence) => {
      setCurrentActiveUsers(presence);
    });
  }, [handlePresenceSync]);

  return (
    <StyledWorkspacePage>
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
                <ResultPanelHeader />
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
    </StyledWorkspacePage>
  );
};

const StyledWorkspacePage = styled(Box)<BoxProps>(({ theme }) => ({
  height: `calc(100vh - 48px)`,
  [`& .${cls.horizontalHandler}`]: {
    cursor: 'row-resize!important',
    height: 30,
    border: `1px solid ${alpha('#fff', 0.1)}`,
  },
  [`& .${cls.splitter}`]: {
    width: '4px!important',
    border: '0px!important',
    background: '#181c31!important',
  },
}));

export default WorkspaceView;
