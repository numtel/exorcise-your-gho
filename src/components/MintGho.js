import { useState, useContext } from 'react';
import { useSignTypedData } from 'wagmi';
import { isAddressEqual } from 'viem';

import { chainContracts } from '../contracts.js';
import { GlobalContext } from './GlobalData.js';
import Transaction from './Transaction.js';

export default function MintGho({
  id,
  positionValue,
  ghoMinted,
  isWrapped,
  position,
}) {
  const [ global ] = useContext(GlobalContext);
  const [ mintAmount, setMintAmount ] = useState('0');
  const chain = chainContracts();
  const ghoMintedHuman = ghoMinted / 10n ** chain.ghoDecimals;
  const maxAmount = global.basis ? (positionValue * global.maxLTV / global.basis) - ghoMintedHuman : 0n;

  const [ deadline, setDeadline ] = useState(
    Math.floor(Date.now() / 1000) + (60 * 60 * 24)); // 24 hours from now

  const {
    data: signData,
    isError: signError,
    isLoading: signLoading,
    isSuccess: signSuccess,
    signTypedData
  } = useSignTypedData({
    domain: {
      version: '1',
      name: 'Uniswap V3 Positions NFT-V1',
      chainId: chain.chain,
      verifyingContract: chain.NonfungiblePositionManager.address,
    },
    message: {
      spender: chain.UniswapV3PositionFacilitator.address,
      tokenId: id,
      nonce: position[0],
      deadline,
    },
    primaryType: 'Permit',
    types: {
      Permit: [
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'tokenId',
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
    {isWrapped ?
      <Transaction submitText="Mint GHO"
        disabled={mintAmount < 1}
        writeArgs={{
          ...chain.UniswapV3PositionFacilitator,
          functionName: 'mintGho',
          args: [ id, BigInt(mintAmount) * (10n ** chain.ghoDecimals) ],
        }} /> :
      <>
        <button disabled={signData} type="button" onClick={signTypedData}>
          Sign Wrap Permit
        </button>
        <Transaction disabled={!signData} submitText="Wrap and Mint GHO" writeArgs={{
          ...chain.UniswapV3PositionFacilitator,
          functionName: 'wrapAndMintGhoWithPermit',
          args: [
            id,
            BigInt(mintAmount) * (10n ** chain.ghoDecimals),
            signData,
            deadline,
          ],
        }} />
    </>}
  </>);
}
