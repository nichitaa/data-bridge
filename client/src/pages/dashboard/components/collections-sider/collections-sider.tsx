import { Box } from '@mui/material';
import { Resizable, ResizableProps } from 'react-resizable';
import { useState } from 'react';
import { useWindowSize } from '@react-hookz/web';
import {
  collectionsSiderClasses,
  collectionsSiderConfig,
} from './collections-sider.constants';

const cfg = collectionsSiderConfig;
const cls = collectionsSiderClasses;

const CollectionsSider = () => {
  const { height: windowHeight } = useWindowSize();
  const maxWindowHeight = windowHeight - 48 - 1;
  const [dimensions, setDimensions] = useState({
    width: cfg.maxWidth,
    height: maxWindowHeight,
  });

  const handleResize: ResizableProps['onResize'] = (event, { size }) => {
    setDimensions({ width: size.width, height: size.height });
  };

  return (
    <Box
      sx={{
        [`& .${cls.wrapper}`]: {
          maxWidth: dimensions.width,
          height: dimensions.height,
        },
        '& .react-resizable-handle': {
          background: '#181c31',
          maxWidth: `${cfg.handlerWidth}px`,
          height: '100%',
          cursor: 'e-resize',
        },
      }}
    >
      <Resizable
        height={dimensions.height}
        width={dimensions.width}
        maxConstraints={[cfg.maxWidth, maxWindowHeight]}
        minConstraints={[cfg.handlerWidth, maxWindowHeight]}
        axis={'x'}
        onResize={handleResize}
        // step
        draggableOpts={{ grid: [cfg.step, cfg.step] }}
        resizeHandles={['se']}
      >
        <div className={cls.wrapper}>
          <Box sx={{ overflow: 'auto', height: '100%' }}>
            <Box sx={{ minWidth: cfg.maxWidth }}>
              Collections tree view here
            </Box>
          </Box>
        </div>
      </Resizable>
    </Box>
  );
};

export default CollectionsSider;
