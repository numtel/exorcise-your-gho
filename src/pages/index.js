import Head from 'next/head';
import { ConnectKitButton } from 'connectkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faEthereum } from '@fortawesome/free-brands-svg-icons';

import ListPositions from '../components/ListPositions.js';
import Leaderboard from '../components/Leaderboard.js';

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
        <h1 className="logo"><span>Exorcise Your GHO</span></h1>
        <p>Mint up to 90% of the value of your Uniswap GHO liquidity positions.</p>
        <p>Use <a href="https://gho.aave.com" rel="noopener" target="_blank">
          Aave Sepolia
          <FontAwesomeIcon icon={faUpRightFromSquare} />
        </a> for USDC faucet and minting GHO.</p>
        <ListPositions />
        <Leaderboard />
        <footer>
          <a href="https://github.com/numtel/exorcise-your-gho" rel="noopener" target="_blank" title="Github Repository">
            <FontAwesomeIcon icon={faGithub} size="2xl" />
          </a>&nbsp;
          <a href="https://ethglobal.com/events/lfgho/home" rel="noopener" target="_blank" title="LFGHO Hackathon">
            <FontAwesomeIcon icon={faEthereum} size="2xl" />
          </a>
        </footer>
      </main>
    </>
  )
}
