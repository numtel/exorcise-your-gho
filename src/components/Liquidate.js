import { useState, useContext } from 'react';
import { useAccount, useContractReads, erc20ABI } from 'wagmi';

import { chainContracts } from '../contracts.js';
import { GlobalContext } from './GlobalData.js';
import Transaction from './Transaction.js';

export default function Liquidate({ id, positionValue, ghoMinted }) {
  const { address: account } = useAccount();
  const [ global ] = useContext(GlobalContext);
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
  const success = data && data[0].status !== 'failure';
  const ghoMintedHuman = ghoMinted / 10n ** chain.ghoDecimals;
  const balance = success ? data[0].result / 10n ** chain.ghoDecimals : 0;
  const maxAmount = ghoMinted > balance ? ghoMintedHuman : balance;
  const needsApproval = data ? data[1].result < ghoMinted : ghoMinted > 0;
  const liquidation = global.basis ? (positionValue * global.liquidate / global.basis) : 0n;
  const canLiquidate = liquidation > 0 && ghoMintedHuman >= liquidation;
  const hasBalanceToLiquidate = balance >= ghoMintedHuman;
  if(!canLiquidate)
    return (<p className="form-status">Below liquidation threshold</p>);
  if(!success)
    return (<p className="form-status">Connect wallet to liquidate</p>);
  if(balance < ghoMintedHuman)
    return (<p className="form-status">Insufficient GHO balance to liquidate</p>);
  if(needsApproval)
    return (<Transaction submitText={`Approve ${ghoMintedHuman} GHO`} writeArgs={{
      address: chain.ghoToken,
      abi: erc20ABI,
      chainId: chain.chain,
      functionName: 'approve',
      args: [ chain.UniswapV3PositionFacilitator.address, ghoMinted ],
    }} />);
  return (<Transaction submitText={`Acquire Position for ${ghoMintedHuman} GHO`} writeArgs={{
    ...chain.UniswapV3PositionFacilitator,
    functionName: 'liquidate',
    args: [ id ],
  }} />);
}
