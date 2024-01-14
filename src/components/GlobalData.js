import React, { createContext, useState, useEffect } from 'react';
import { useContractReads } from 'wagmi';

import { chainContracts } from '../contracts.js';

export const GlobalContext = createContext(null);

export function GlobalData({children}) {
  const globalState = useState({});
  const chain = chainContracts();

  useContractReads({
    contracts: [
      {
        ...chain.UniswapV3PositionFacilitator,
        functionName: 'BASIS',
      },
      {
        ...chain.UniswapV3PositionFacilitator,
        functionName: 'MAX_LTV',
      },
      {
        ...chain.UniswapV3PositionFacilitator,
        functionName: 'LIQUIDATE',
      },
    ],
    onSuccess(data) {
      globalState[1](global => Object.assign(global, {
        basis: data[0].result,
        maxLTV: data[1].result,
        liquidate: data[2].result,
      }));
    },
    onError() {
      globalState[1](global => Object.assign(global, {
        basis: false,
      }));
    },
  });

  return (<>
    <GlobalContext.Provider value={globalState}>
      {children}
    </GlobalContext.Provider>
  </>);
}
