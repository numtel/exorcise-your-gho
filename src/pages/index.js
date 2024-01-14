import Head from 'next/head';
import { ConnectKitButton } from 'connectkit';

import ListPositions from '../components/ListPositions.js';

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
      <main>
        <div className="connectkit">
          <ConnectKitButton />
        </div>
        <h1 className="logo">Exorcise Your GHO</h1>
        <ListPositions />
      </main>
    </>
  )
}
