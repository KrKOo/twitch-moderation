import StreamOverlay from "components/StreamOverlay/StreamOverlay"
import OverlayMenu from "components/OverlayMenu/OverlayMenu"
import { SocketProvider } from "contexts/socketContext"

import styles from 'styles/Dashboard.module.scss'
import { DasboardContextProvider } from "contexts/dashboardContext"

export default function Dashboard() {
  return (
    <SocketProvider>
      <DasboardContextProvider>
        <div className={styles.overlayControlContainer}>
          <OverlayMenu className={styles.OverlayMenu} />
          <StreamOverlay className={styles.StreamOverlay} backgroundImage='https://www.yorkstonguesthouse.co.uk/wp-content/uploads/2017/09/Rectangle-1920x1080-Placeholder.png' />
          {/* <StreamOverlay className={styles.StreamOverlay} /> */}
        </div>
      </DasboardContextProvider>
    </SocketProvider>
  )
}
