import { useState } from 'react';

import { useAccount, useContractReads, useSignTypedData } from 'wagmi';

import { chainContracts } from '../contracts.js';
import erc20PermitABI from '../abi/ERC20Permit.json';
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
        abi: erc20PermitABI,
        chainId: chain.chain,
        functionName: 'balanceOf',
        args: [ account ],
      },
      {
        address: chain.ghoToken,
        abi: erc20PermitABI,
        chainId: chain.chain,
        functionName: 'nonces',
        args: [ account ],
      },
    ],
    watch: true,
  });

  if(data && data[0].status === 'failure')
    return (<p className="form-status error">Error loading details!</p>);
  const ghoMintedHuman = ghoMinted / 10n ** chain.ghoDecimals;
  const balance = data ? data[0].result / 10n ** chain.ghoDecimals : 0;
  const maxAmount = ghoMinted > balance ? ghoMintedHuman : balance;
  const canUnwrap = balance >= ghoMintedHuman;

  const [ deadline, setDeadline ] = useState(
    Math.floor(Date.now() / 1000) + (60 * 60 * 24)); // 24 hours from now

  const {
    data: signData,
    isError: signError,
    isLoading: signLoading,
    isSuccess: signSuccess,
    reset: resetSign,
    signTypedData
  } = useSignTypedData({
    domain: {
      version: '1',
      name: chain.ghoTokenName,
      chainId: chain.chain,
      verifyingContract: chain.ghoToken,
    },
    message: {
      owner: account,
      spender: chain.UniswapV3PositionFacilitator.address,
      value: ghoMinted,
      nonce: data && data[1].result,
      deadline,
    },
    primaryType: 'Permit',
    types: {
      Permit: [
        {
          name: 'owner',
          type: 'address',
        },
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
        {
          name: 'nonce',
          type: 'uint256',
        },
        {
          name: 'deadline',
          type: 'uint256',
        },
      ],
    },
  });

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
      <><button disabled={signData} type="button" onClick={signTypedData}>
          Sign Spend Permit
        </button>
        <Transaction
          submitText="Repay GHO"
          disabled={repayAmount < 1 || !signData}
          writeArgs={{
            ...chain.UniswapV3PositionFacilitator,
            functionName: 'repayGhoWithPermit',
            args: [
              id,
              BigInt(repayAmount) * (10n ** chain.ghoDecimals),
              signData,
              deadline
            ],
            onSuccess() {
              resetSign();
            },
          }}
        />
        <Transaction
          disabled={!canUnwrap || !signData}
          submitText={ghoMinted > 0 ? "Repay Full and Unwrap" : "Unwrap"}
          writeArgs={{
            ...chain.UniswapV3PositionFacilitator,
            functionName: 'repayGhoAndUnwrapWithPermit',
            args: [ id, signData, deadline ],
            onSuccess() {
              resetSign();
            },
          }}
        />
      </>}
  </>);
}
