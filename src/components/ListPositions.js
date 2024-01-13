import { useState } from 'react';
import { useContractReads, useAccount, erc721ABI } from 'wagmi';
import { isAddressEqual } from 'viem';

import { chainContracts } from '../contracts.js';

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
  });

  return (<>
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && <>
      {/*<LoadByIndex {...{account}}
        contract={contracts.UniswapV3PositionFacilitator}
        count={data[0].result}
        next={LoadWrappedById} />*/}
      <LoadByIndex {...{account}}
        contract={chain.NonfungiblePositionManager}
        count={data[1].result}
        next={LoadUnwrappedById} />
    </>}

  </>);
}

function LoadByIndex({ contract, count, account, next }) {
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
    {data && <>
      {next({...{account}, ids: data.map(x => x.result)})}
    </>}
  </>);
}

function LoadUnwrappedById({ ids, account }) {
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
    {data && (<ul className="positions unwrapped">
      {data.map((positionResult, index) => {
        if(poolAllowed(positionResult.result, chain))
          return <LoadSingleUnwrapped id={ids[index]} position={positionResult.result} />;
      })}
    </ul>)}
  </>);
}

function LoadSingleUnwrapped({ id, position }) {
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
  ];
  const { data, isError, isLoading } = useContractReads({ contracts });
  console.log(data);

  return (<li key={id}>
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && <RenderUnwrapped {...{id, position}}
      tokenURI={data[0].result}
      positionValue={data[1].result}
    />}
  </li>);
}

function RenderUnwrapped({ id, tokenURI, position, positionValue }) {
  return (<>
    <p>ID: {String(id)}</p>
    <p>Value: {formatAsDollars(positionValue)}</p>
    <meter min="0" max={String(positionValue)} value="0">0/{String(positionValue)} minted</meter>
  </>);
}

function poolAllowed(position, chain) {
  for(let i = 0; i < chain.allowedPools.length; i++) {
    if(isAddressEqual(position[2], chain.allowedPools[i][0])
        && isAddressEqual(position[3], chain.allowedPools[i][1])) return true;
  }
  return false;
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
