import StreamOverlay from "components/StreamOverlay/StreamOverlay"
import { DasboardContextProvider } from "contexts/dashboardContext"
import { SocketProvider } from "contexts/socketContext"

import styles from 'styles/Dashboard.module.scss'

export default function Dashboard() {
  return (
    <SocketProvider>
      <DasboardContextProvider>
        <StreamOverlay className={styles.StreamOverlay} />
      </DasboardContextProvider>
    </SocketProvider>
  )
}
