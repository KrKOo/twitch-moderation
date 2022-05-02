import { useCallback, useEffect, useRef } from 'react';
import FreeTransform from 'react-free-transform'
import useOnClickOutside from 'hooks/useOnClickOutside';

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

  const contentDiv = useRef(null)
  const handleClickOutside = useCallback(() => {
  }, [])

  const focused = useOnClickOutside(contentDiv, handleClickOutside);

  useEffect(() => {
    console.log(focused);
  }, [focused]);

  return <div className={`${styles.OverlayElement}`} ref={contentDiv}>
    <FreeTransform
      {...props}
      onUpdate={(payload: any) => { if (props.onUpdate) props.onUpdate(props.id, payload) }}
    >
      <div style={{ background: 'red', width: props.width, height: props.height }}></div>
    </FreeTransform >
  </div>
}

export default OverlayElement;