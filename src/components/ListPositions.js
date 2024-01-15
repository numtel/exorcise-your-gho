import { useContractReads, useAccount } from 'wagmi';
import { isAddressEqual } from 'viem';
import { ConnectKitButton } from 'connectkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { chainContracts } from '../contracts.js';
import RenderPosition from './RenderPosition.js';

export default function ListPositions() {
  const { address: account } = useAccount();
  const chain = chainContracts();

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...chain.UniswapV3PositionFacilitator,
        functionName: 'balanceOf',
        args: [ account ],
      },
      {
        ...chain.NonfungiblePositionManager,
        functionName: 'balanceOf',
        args: [ account ],
      },
    ],
    watch: true,
  });

  const addButtons = [];
  for(let pool of chain.allowedPools) {
    addButtons.push(
      <a key={pool[0]+pool[1]} href={chain.addLiquidity + pool[0] + '/' + pool[1]} rel="noopener" target="_blank">
        <button type="button">
          Add {pool[2]}&nbsp;
          <FontAwesomeIcon icon={faUpRightFromSquare} />
        </button>
      </a>
    );
  }

  return (<>
    <h2>
      <div className="header-buttons">
        {addButtons}
      </div>
      Positions
    </h2>
    {!account && <div className="not-connected">
      <ConnectKitButton />
    </div>}
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && <>
      <LoadByIndex {...{account}}
        contract={chain.UniswapV3PositionFacilitator}
        count={data[0].result}
        isWrapped={true} />
      <LoadByIndex {...{account}}
        contract={chain.NonfungiblePositionManager}
        count={data[1].result}
        isWrapped={false} />
    </>}

  </>);
}

function LoadByIndex({ contract, count, account, isWrapped }) {
  const contracts = [];
  for(let i = 0; i < count; i++) {
    contracts.push({
      ...contract,
      functionName: 'tokenOfOwnerByIndex',
      args: [ account, i ],
    });
  }
  const { data, isError, isLoading } = useContractReads({ contracts });

  return (<>
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && <LoadById {...{isWrapped}} ids={data.map(x => x.result)} />}
  </>);
}

export function LoadById({ ids, isWrapped }) {
  const chain = chainContracts();
  const contracts = [];
  for(let i = 0; i < ids.length; i++) {
    if(!ids[i]) continue;
    contracts.push({
      ...chain.NonfungiblePositionManager,
      functionName: 'positions',
      args: [ ids[i] ],
    });
  }
  const { data, isError, isLoading } = useContractReads({ contracts });

  return (<>
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && (<ul className={'positions ' + (isWrapped === 'liquidation' ? isWrapped : isWrapped ? 'wrapped' : 'unwrapped')}>
      {data.map((positionResult, index) => {
        if(poolAllowed(positionResult.result, chain))
          return <LoadSingle
            key={ids[index]}
            id={ids[index]}
            position={positionResult.result}
            {...{isWrapped}} />;
      })}
    </ul>)}
  </>);
}

function LoadSingle({ id, position, isWrapped }) {
  const chain = chainContracts();
  const contracts = [
    {
      ...chain.NonfungiblePositionManager,
      functionName: 'tokenURI',
      args: [ id ],
    },
    {
      ...chain.UniswapV3PositionFacilitator,
      functionName: 'positionValue',
      args: [ id ],
    },
    {
      ...chain.UniswapV3PositionFacilitator,
      functionName: 'ghoMintedByTokenId',
      args: [ id ],
    },
  ];
  const { data, isError, isLoading } = useContractReads({
    contracts,
    watch: true,
  });

  return (<li key={id}>
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && <RenderPosition {...{id, position, isWrapped}}
      tokenURI={data[0].result}
      positionValue={data[1].result}
      ghoMinted={data[2].result}
    />}
  </li>);
}

function poolAllowed(position, chain) {
  for(let i = 0; i < chain.allowedPools.length; i++) {
    if(isAddressEqual(position[2], chain.allowedPools[i][0])
        && isAddressEqual(position[3], chain.allowedPools[i][1])) return true;
  }
  return false;
}

