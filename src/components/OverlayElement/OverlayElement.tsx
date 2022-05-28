import { useCallback, useRef, useState } from 'react';
import FreeTransform from 'react-free-transform'
import useOnElementClick from 'hooks/useOnElementClick';

import styles from './OverlayElement.module.scss'

export interface OverlayElementTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
}

export interface OverlayElementProps extends OverlayElementTransform {
  id: number;
  style?: React.CSSProperties;
  isImage: boolean;
  value?: string;

  offsetX?: number;
  offsetY?: number;
  onUpdate?: (payload: any) => void;
  children?: React.ReactChild;
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

  let content = props.children;
  if (props.isImage) {
    {/* eslint-disable-next-line @next/next/no-img-element */ }
    content = <img src={props.value} alt="" />
  }
  else if (!content) {
    content = <div style={props.style}>{props.value}</div>
  }

  return <div className={`${styles.OverlayElement} ${isFocused && styles.Focused}`} ref={contentDiv}>
    <FreeTransform
      {...props}
      disableScale={true}
      onUpdate={(payload: Partial<OverlayElementTransform>) => { if (props.onUpdate) props.onUpdate(payload) }}
    >
      <div className={styles.OverlayElementContent}>
        {content}
      </div>
    </FreeTransform >
  </div>
}

export default OverlayElement;