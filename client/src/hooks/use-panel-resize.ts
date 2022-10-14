import { RecoilState, useRecoilState, useResetRecoilState } from 'recoil';
import { ReflexElementProps } from 'react-reflex';
import { useRef } from 'react';

interface Params {
  sizeAtom: RecoilState<number>;
  minSizeAtom: RecoilState<number>;
  maxSizeAtom: RecoilState<number>;
}

export const usePanelResize = (params: Params) => {
  const { minSizeAtom, maxSizeAtom, sizeAtom } = params;

  const [size, setSize] = useRecoilState(sizeAtom);
  const [min, setMin] = useRecoilState(minSizeAtom);
  const [max, setMax] = useRecoilState(maxSizeAtom);

  const resetMax = useResetRecoilState(maxSizeAtom);

  const animationRequestRef = useRef<number>(undefined!);

  const maximizePanel = (maxWidth: number) => {
    resetMax();

    const animationStepFn = () => {
      setSize((prev) => {
        if (prev <= maxWidth) {
          prev += 30;
          animationRequestRef.current =
            window.requestAnimationFrame(animationStepFn);
          return prev;
        } else {
          window.cancelAnimationFrame(animationRequestRef.current);
        }
        return prev;
      });
    };
    animationStepFn();
  };

  const onStopResize: ReflexElementProps['onStopResize'] = ({ domElement }) => {
    const width = (domElement as HTMLElement).offsetWidth;
    if (width <= min) {
      setMin(30);
      setSize(30);
      setMax(30);
    } else {
      setSize(width);
    }
  };

  const onResize: ReflexElementProps['onResize'] = ({ domElement }) => {
    const width = (domElement as HTMLElement).offsetWidth;
    if (width <= 100) {
      setMin(width);
    }
  };

  return {
    onResize,
    onStopResize,
    maximizePanel,
    max,
    min,
    size,
  };
};
