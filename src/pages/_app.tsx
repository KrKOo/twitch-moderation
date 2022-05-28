import { AppProps } from 'next/app';
import React from 'react';

import '../styles/globals.scss'

function App({ Component, pageProps }: AppProps) {
  return <React.StrictMode>
    <Component {...pageProps} />
  </React.StrictMode>
}

export default App