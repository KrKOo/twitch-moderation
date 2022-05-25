import styles from './OverlayMenu.module.scss'

export interface OverlayMenuProps {
  className?: string;
}

const OverlayMenu = (props: OverlayMenuProps) => {

  return <div className={`${styles.OverlayElement} ${props.className || ''}`}>

  </div>
}

export default OverlayMenu;