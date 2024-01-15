import { useState, useContext } from 'react';
import { useContractReads } from 'wagmi';
import { isAddressEqual } from 'viem';

import { chainContracts } from '../contracts.js';
import { GlobalContext } from './GlobalData.js';
import Transaction from './Transaction.js';

export default function MintGho({
  id,
  positionValue,
  ghoMinted,
  isWrapped,
}) {
  const [ global ] = useContext(GlobalContext);
  const [ mintAmount, setMintAmount ] = useState('0');
  const chain = chainContracts();
  const ghoMintedHuman = ghoMinted / 10n ** chain.ghoDecimals;
  const maxAmount = global.basis ? (positionValue * global.maxLTV / global.basis) - ghoMintedHuman : 0n;

  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        ...chain.NonfungiblePositionManager,
        functionName: 'getApproved',
        args: [ id ],
      },
    ],
    watch: true,
  });

  return (<>
    <label>
      <span>Mint</span>
      <input
        type="number"
        min="0"
        max={String(maxAmount)}
        step="1"
        value={mintAmount}
        onChange={(e) => setMintAmount(e.target.value)}
        />
    </label>
    <p className="field-help">{global.basis ? <>Max:&nbsp;
      <a href="#" onClick={(e) => {
        e.preventDefault();
        setMintAmount(String(maxAmount));
      }}>
        {String(maxAmount)} GHO
      </a></> : global.basis === false ? <>Error, try refreshing!</> : <>Loading...</>}</p>
    {isLoading ? <p>Loading status...</p> :
      isError ? <p>Error loading status.</p> :
      isWrapped ?
        <Transaction submitText="Mint GHO"
          disabled={mintAmount < 1}
          writeArgs={{
            ...chain.UniswapV3PositionFacilitator,
            functionName: 'mintGho',
            args: [ id, BigInt(mintAmount) * (10n ** chain.ghoDecimals) ],
          }} /> :
      data && isAddressEqual(data[0].result, chain.UniswapV3PositionFacilitator.address) ?
        <Transaction submitText="Wrap and Mint GHO" writeArgs={{
          ...chain.UniswapV3PositionFacilitator,
          functionName: 'wrapAndMintGho',
          args: [ id, BigInt(mintAmount) * (10n ** chain.ghoDecimals) ],
        }} /> :
      data ?
        <Transaction submitText="Approve Wrap" writeArgs={{
          ...chain.NonfungiblePositionManager,
          functionName: 'approve',
          args: [ chain.UniswapV3PositionFacilitator.address, id ],
        }} /> :
      <p>Unknown error! Refresh.</p>}
  </>);
}