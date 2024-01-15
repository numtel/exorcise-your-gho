import { useState } from 'react';
import { useContractReads } from 'wagmi';

import { chainContracts } from '../contracts.js';
import { LoadById } from './ListPositions.js';
import Paging from './Paging.js';

const PER_PAGE = 10;

export default function Leaderbaord() {
  const [ show, setShow ] = useState(false);
  const chain = chainContracts();

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...chain.UniswapV3PositionFacilitator,
        functionName: 'totalSupply',
        args: [],
      },
    ],
  });

  if(!show) return(<div className="leaderboard-placeholder">
    <button type="button" onClick={() => setShow(true)}>
      Load Liquidation Leaderboard...
    </button>
  </div>);

  return (<>
    <h2>
      Liquidation Leaderboard
    </h2>
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && <Paging
        count={Number(data[0].result)}
        perPage={PER_PAGE}
        renderChild={(index) =>
          <LoadByIndex
            contract={chain.UniswapV3PositionFacilitator}
            key={index}
            start={index * PER_PAGE}
            count={PER_PAGE}
            />}
        />}

  </>);
}

function LoadByIndex({ contract, start, count }) {
  const contracts = [];
  for(let i = start; i < start + count; i++) {
    contracts.push({
      ...contract,
      functionName: 'tokenByIndex',
      args: [ i ],
    });
  }
  const { data, isError, isLoading } = useContractReads({ contracts });

  return (<>
    {isLoading && <p className="status loading">Loading...</p>}
    {isError && <p className="status error">Error Loading!</p>}
    {data && <LoadById isWrapped="liquidation" ids={data.map(x => x.result)} />}
  </>);
}

