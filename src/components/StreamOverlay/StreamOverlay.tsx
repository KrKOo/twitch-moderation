import { useRef, useEffect, useCallback } from "react";

import { useNoRenderRef } from "hooks/useNoRenderRef";
import { useWindowSize } from "hooks/useWindowSize";
import OverlayElement, { OverlayElementTransform } from 'components/OverlayElement/OverlayElement';
import { useDashboardContext, ActionType, Scale, RelativeOverlayElementTransform, Transformation } from "contexts/dashboardContext";
import { useSocket } from "hooks/useSocket";

import styles from './StreamOverlay.module.scss';

interface StreamOverlayProps {
  className?: string;
  backgroundImage?: string;
}

const getRelativeTransform = (element: OverlayElementTransform, scale: Scale): RelativeOverlayElementTransform => {
  const { x, y, width, height, ...relativeElement } = element;

  return ({
    ...relativeElement,
    relativeWidth: element.width * element.scaleX * scale.x,
    relativeHeight: element.height * element.scaleY * scale.y,
    relativeX: element.x * scale.x,
    relativeY: element.y * scale.y
  })
}

const StreamOverlay = (props: StreamOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const streamResolution = useNoRenderRef({ width: 1920, height: 1080 });

  const socket = useSocket();

  const { state, dispatch } = useDashboardContext();

  const handleSocketConnect = () => {
    console.log("connected");
  }

  const handleTransform = useCallback((data: any) => {
    dispatch({ type: ActionType.UPDATE_TRANSFORMATION, data: data })
  }, [dispatch]);

  // Socket initialization 
  useEffect(() => {
    socket.on('connect', handleSocketConnect)
    socket.on('elementTransform', handleTransform)

    return () => {
      socket.off("connect", handleSocketConnect)
      socket.off("elementTransform", handleTransform);
    };
  }, [handleTransform, socket]);

  // On window resize
  useEffect(() => {
    const scale = {
      x: streamResolution.current.width / (overlayRef.current?.clientWidth || streamResolution.current.width),
      y: streamResolution.current.height / (overlayRef.current?.clientHeight || streamResolution.current.height)
    }

    dispatch({ type: ActionType.UPDATE_RESOLUTION, data: scale });
  }, [dispatch, streamResolution, windowSize])

  const getElementById = (id: number) => {
    const index = state.elements.findIndex((element) => element.id === id);
    if (index !== -1) {
      return state.elements[index];
    }
    return null;
  }

  const getElementTransform = (id: number): OverlayElementTransform | null => {
    const element = getElementById(id);
    if (!element) return null;

    return {
      width: element.width,
      height: element.height,
      x: element.x,
      y: element.y,
      scaleX: element.scaleX,
      scaleY: element.scaleY,
      angle: element.angle
    }
  }

  // On element transform 
  const handleElementUpdate = (id: number, payload: Partial<OverlayElementTransform>) => {
    const elementTransform = getElementTransform(id);
    if (!elementTransform) return;

    const data = { ...elementTransform, ...payload };
    const relativeTransform = getRelativeTransform(data, state.scale);
    const transformation: Transformation = { ...relativeTransform, id: id }

    socket.emit('elementTransform', transformation);
    handleTransform(transformation);
  }

  return <div ref={overlayRef} className={`${styles.StreamOverlay} ${props.className || ''}`}>
    {
      state.elements.map((element) => {
        return <OverlayElement
          key={element.id}
          onUpdate={(payload) => handleElementUpdate(element.id, payload)}
          {...element}
          offsetX={overlayRef.current?.offsetLeft || 0}
          offsetY={overlayRef.current?.offsetTop || 0}
        />
      })
    }

    {/* eslint-disable-next-line @next/next/no-img-element */}
    {props.backgroundImage && <img id={styles.thumbnail} src={props.backgroundImage} alt='thumbnail' />}
  </div >
};

export default StreamOverlay;