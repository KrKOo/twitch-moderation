import { useState, useRef, useEffect, useCallback } from "react";

import { useNoRenderRef } from "hooks/useNoRenderRef";
import { useWindowSize } from "hooks/useWindowSize";
import OverlayElement, { OverlayElementProps } from './OverlayElement';

import styles from './StreamOverlay.module.scss';
import { useSocket } from "hooks/useSocket";

interface RelativeOverlayElementProps extends OverlayElementProps {
  relativeWidth: number;
  relativeHeight: number;
  relativeX: number;
  relativeY: number;
}

const StreamOverlay = () => {
  const initialElements = [
    {
      id: 1,
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      relativeWidth: 100,
      relativeHeight: 100,
      relativeX: 100,
      relativeY: 100,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      offsetX: 0,
      offsetY: 0
    }];

  const [elements, setElements] = useState<RelativeOverlayElementProps[]>(initialElements);

  // Scale coeficient
  const [scale, setScale] = useState({ x: 1, y: 1 })

  const overlayRef = useRef<HTMLDivElement>(null);
  const elementsNoRenderRef = useNoRenderRef(elements);
  const windowSize = useWindowSize();
  const streamResolution = useNoRenderRef({ width: 1920, height: 1080 });

  const socket = useSocket();

  const getRelativeTransformation = (element: RelativeOverlayElementProps) => {
    return ({
      relativeWidth: element.width * element.scaleX * scale.x,
      relativeHeight: element.height * element.scaleY * scale.y,
      relativeX: element.x * scale.x,
      relativeY: element.y * scale.y,
    })
  }

  const getAbsoluteTransofmation = useCallback((element: RelativeOverlayElementProps) => {
    return ({
      width: element.relativeWidth / (element.scaleX * scale.x),
      height: element.relativeHeight / (element.scaleY * scale.y),
      x: element.relativeX / scale.x,
      y: element.relativeY / scale.y,
    })
  }, [scale.x, scale.y])

  const handleSocketConnect = () => {
    console.log("connected");
  }

  const handleSocketTransform = useCallback((data: RelativeOverlayElementProps) => {
    const index = elementsNoRenderRef.current.findIndex((item: RelativeOverlayElementProps) => item.id === data.id);
    if (index !== -1) {
      setElements(prevItems => {
        prevItems[index] = { ...data, ...getAbsoluteTransofmation(data) }
        return [...prevItems]
      });
    }
  }, [elementsNoRenderRef, getAbsoluteTransofmation])

  // Initialize the socket
  useEffect(() => {
    socket.on('connect', handleSocketConnect)
    socket.on('elementTransform', handleSocketTransform)

    return () => {
      socket.off("connect", handleSocketConnect)
      socket.off("elementTransform", handleSocketTransform);
    };
  }, [handleSocketTransform, socket]);


  // Recalculate the scaling on window resize
  useEffect(() => {
    setScale({
      x: streamResolution.current.width / (overlayRef.current?.clientWidth || streamResolution.current.width),
      y: streamResolution.current.height / (overlayRef.current?.clientHeight || streamResolution.current.height)
    })
  }, [streamResolution, windowSize])

  // Recalculate the size and position of all elements
  useEffect(() => {
    setElements((prevElements) => {
      const newElements = prevElements.map((element) => {
        element.width = element.relativeWidth / (element.scaleX * scale.x);
        element.height = element.relativeHeight / (element.scaleY * scale.y);
        element.x = element.relativeX / scale.x;
        element.y = element.relativeY / scale.y;
        return element;
      })
      return newElements;
    })
  }, [scale])

  // Called when an element is transformed
  const handleElementUpdate = (id: number, payload: any) => {
    const newElements = elements.map(element => {
      if (element.id === id) {
        let newElement = {
          ...element,
          ...payload
        };
        newElement = { ...newElement, ...getRelativeTransformation(newElement) }
        socket.emit('elementTransform', newElement)
        return newElement;
      }
    })
    setElements(newElements);
  }

  return <div ref={overlayRef} className={styles.StreamOverlay} style={{ width: '100vw', height: '100vh' }}>
    {elements.map((element) => {
      return <OverlayElement
        key={element.id}
        onUpdate={handleElementUpdate}
        {...element}
      />
    })}
  </div >
};

export default StreamOverlay;
