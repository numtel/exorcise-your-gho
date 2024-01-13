import Head from 'next/head';
import { Inter } from 'next/font/google';
import { ConnectKitButton } from 'connectkit';

import ListPositions from '../components/ListPositions.js';

const inter = Inter({ subsets: ['latin'] });

/*
 * List my position manager nfts + my wrapped position nfts
 * Meter bar with amount minted vs liquidation
 *
 */

export default function Home() {
  return (
    <>
      <Head>
        <title>Exorcise Your GHO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${inter.className}`}>
        <h1 className="logo">Exorcise Your GHO</h1>
        <ConnectKitButton />
        <ListPositions />
      </main>
    </>
  )
}
