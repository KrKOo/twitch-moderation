import StreamOverlay from "components/StreamOverlay/StreamOverlay"
import { SocketProvider } from "contexts/socketContext"

import styles from 'styles/Dashboard.module.scss'

export default function Dashboard() {
  return (
    <SocketProvider>
      <StreamOverlay className={styles.StreamOverlay} />
    </SocketProvider>
  )
}
