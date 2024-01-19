import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { chainContracts } from '../contracts.js';
import { GlobalContext } from './GlobalData.js';
import SlideIn from './SlideIn.js';
import MintGho from './MintGho.js';
import RepayGho from './RepayGho.js';
import Liquidate from './Liquidate.js';
import CollectFees from './CollectFees.js';

export default function RenderPosition({
  id,
  tokenURI,
  position,
  positionValue,
  ghoMinted,
  isWrapped,
}) {
  const [ global ] = useContext(GlobalContext);
  const chain = chainContracts();
  const tokenData = JSON.parse(atob(tokenURI.slice('data:application/json;base64,'.length)));
  const ghoMintedHuman = ghoMinted / 10n ** chain.ghoDecimals;
  const ltv = global.basis ? Number(ghoMintedHuman * 1000n / positionValue) / 10 : null;
  // 90% of max LTV
  const safeLtv = global.basis ? positionValue * global.maxLTV * 90n / (global.basis * 100n) : 0n;
  const liquidate = global.basis ? positionValue * global.liquidate / global.basis : 0n;
  const isLiquidation = isWrapped === 'liquidation';
  return (<>
    <a href={chain.poolManager.replace('XXX', String(id))} rel="noopener" target="_blank"
        title="View Position Details on Uniswap">
      <SlideIn>
        <img className={'shimmer' + (isLiquidation ? ' liquidation' : '')} src={tokenData.image} alt="Position Graphical Representation" />
      </SlideIn>
    </a>
    <SlideIn>
      <div className="values">
        <meter
          min="0"
          low={String(safeLtv)}
          high={String(liquidate)}
          optimum="0"
          max={String(positionValue)}
          value={String(ghoMintedHuman)}
        >{String(ghoMintedHuman)} GHO minted</meter>
        <div className="captions">
          <p>
            <a href={chain.poolManager.replace('XXX', String(id))} rel="noopener" target="_blank">
              Worth {formatAsDollars(positionValue)}&nbsp;
              <FontAwesomeIcon icon={faUpRightFromSquare} />
            </a>&nbsp;
            {isWrapped === true && <CollectFees {...{id}} />}
          </p>
          <p>{String(ghoMintedHuman)} GHO Minted {ltv ? <>({ltv}% LTV)</> : null}</p>
        </div>

        <div className="actions">
          {isLiquidation ? <Liquidate {...{id, positionValue, ghoMinted}} /> : <>
            <div className="action">
              <MintGho {...{id, positionValue, ghoMinted, isWrapped, position}} />
            </div>
            {isWrapped && <div className="action">
              <RepayGho {...{id, positionValue, ghoMinted, isWrapped}} />
            </div>}
          </>}
        </div>
      </div>
    </SlideIn>
  </>);
}

// Thanks ChatGPT4
function formatAsDollars(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
