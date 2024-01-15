import { useState, useContext } from 'react';

import { useAccount, useContractReads, erc20ABI } from 'wagmi';

import { chainContracts } from '../contracts.js';
import { GlobalContext } from './GlobalData.js';
import Transaction from './Transaction.js';

export default function RepayGho({
  id,
  positionValue,
  ghoMinted,
}) {
  const { address: account } = useAccount();
  const [ repayAmount, setRepayAmount ] = useState('0');
  const chain = chainContracts();
  const { data, isError, isLoading } = useContractReads({
    contracts: [
      {
        address: chain.ghoToken,
        abi: erc20ABI,
        chainId: chain.chain,
        functionName: 'balanceOf',
        args: [ account ],
      },
      {
        address: chain.ghoToken,
        abi: erc20ABI,
        chainId: chain.chain,
        functionName: 'allowance',
        args: [ account, chain.UniswapV3PositionFacilitator.address ],
      },
    ],
    watch: true,
  });

  const ghoMintedHuman = ghoMinted / 10n ** chain.ghoDecimals;
  const balance = data ? data[0].result / 10n ** chain.ghoDecimals : 0;
  const maxAmount = ghoMinted > balance ? ghoMintedHuman : balance;
  const needsApproval = data ? data[1].result < repayAmount : true;
  const canUnwrap = balance >= ghoMintedHuman;
  const needsUnwrapApproval = data ? data[1].result < ghoMinted : ghoMinted > 0;

  return (<>
    <label>
      <span>Repay</span>
      <input
        type="number"
        min="0"
        max={String(maxAmount)}
        step="1"
        value={repayAmount}
        onChange={(e) => setRepayAmount(e.target.value)}
        />
    </label>
    <p className="field-help">{data ? <>
      Balance:&nbsp;
      <a href="#" onClick={(e) => {
        e.preventDefault();
        setRepayAmount(String(maxAmount));
      }}>
        {String(balance)} GHO
      </a></> : isError  ? <>Error loading balance</> : <>Loading balace...</>}</p>
    {isLoading ? <p>Loading status...</p> :
      isError ? <p>Error loading status.</p> :
      <>{needsApproval ?
        <Transaction submitText="Approve GHO" writeArgs={{
          address: chain.ghoToken,
          abi: erc20ABI,
          chainId: chain.chain,
          functionName: 'approve',
          args: [
            chain.UniswapV3PositionFacilitator.address,
            BigInt(repayAmount) * 10n ** chain.ghoDecimals,
          ],
        }} /> : <Transaction submitText="Repay GHO"
          disabled={repayAmount < 1}
          writeArgs={{
            ...chain.UniswapV3PositionFacilitator,
            functionName: 'repayGho',
            args: [ id, BigInt(repayAmount) * (10n ** chain.ghoDecimals) ],
          }} />}
        {canUnwrap && (needsUnwrapApproval ?
        <Transaction submitText="Approve Full to Unwrap" writeArgs={{
          address: chain.ghoToken,
          abi: erc20ABI,
          chainId: chain.chain,
          functionName: 'approve',
          args: [
            chain.UniswapV3PositionFacilitator.address,
            ghoMinted,
          ],
        }} /> : <Transaction submitText={ghoMinted > 0 ? "Repay Full and Unwrap" : "Unwrap"} writeArgs={{
          ...chain.UniswapV3PositionFacilitator,
          functionName: 'repayGhoAndUnwrap',
          args: [ id ],
        }} />)}
        </>}
  </>);
}
