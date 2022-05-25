import { useCallback, useRef, useState } from 'react';
import FreeTransform from 'react-free-transform'
import useOnElementClick from 'hooks/useOnElementClick';

import styles from './OverlayElement.module.scss'

export interface OverlayElementProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  offsetX: number;
  offsetY: number;
  onUpdate?: (id: number, payload: any) => void;
}

const OverlayElement = (props: OverlayElementProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const contentDiv = useRef(null)
  const handleClickOutside = useCallback(() => {
    setIsFocused(false);
  }, [])
  const handleClickInside = useCallback(() => {
    setIsFocused(true);
  }, [])

  useOnElementClick(contentDiv, handleClickOutside, handleClickInside);

  return <div className={`${styles.OverlayElement} ${isFocused && styles.Focused}`} ref={contentDiv}>
    <FreeTransform
      {...props}
      onUpdate={(payload: any) => { if (props.onUpdate) props.onUpdate(props.id, payload) }}
    >
      <div style={{ background: 'red', width: props.width, height: props.height }}></div>
    </FreeTransform >
  </div>
}

export default OverlayElement;