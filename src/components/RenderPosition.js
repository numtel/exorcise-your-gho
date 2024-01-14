import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { chainContracts } from '../contracts.js';
import SlideIn from './SlideIn.js';
import MintGho from './MintGho.js';

export default function RenderPosition({
  id,
  tokenURI,
  position,
  positionValue,
  ghoMinted,
}) {
  const chain = chainContracts();
  const tokenData = JSON.parse(atob(tokenURI.slice('data:application/json;base64,'.length)));
  return (<>
    <a href={chain.poolManager.replace('XXX', String(id))} rel="noopener" target="_blank"
        title="View Position Details on Uniswap">
      <SlideIn>
        <img className="shimmer" src={tokenData.image} alt="Position Graphical Representation" />
      </SlideIn>
    </a>
    <SlideIn>
      <div className="values">
        <meter min="0" max={String(positionValue)} value="0">0/{String(positionValue)} minted</meter>
        <div className="captions">
          <p>Worth {formatAsDollars(positionValue)}</p>
          <p>0 GHO Minted (0% LTV)</p>
        </div>

        <div className="actions">
          <MintGho {...{id, positionValue, ghoMinted}} />
        </div>
        <p>
          <a href={chain.poolManager.replace('XXX', String(id))} rel="noopener" target="_blank">
            Details on Uniswap&nbsp;
            <FontAwesomeIcon icon={faUpRightFromSquare} />
          </a>
        </p>
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
