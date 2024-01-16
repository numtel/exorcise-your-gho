import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsDollar } from '@fortawesome/free-solid-svg-icons';
import { useAccount, useNetwork, useContractWrite, useWaitForTransaction } from 'wagmi';
import { chainContracts } from '../contracts.js';

export default function CollectFees({ id }) {
  const chain = chainContracts();
  const { address: account } = useAccount();
  const { chain: network } = useNetwork();

  const writeArgs = {
    ...chain.UniswapV3PositionFacilitator,
    functionName: 'collectFees',
    args: [ id ],
  };

  const {data, isLoading, isError, isSuccess, write} = useContractWrite(writeArgs);
  const {
    isError: txError,
    isLoading: txLoading,
    isSuccess: txSuccess
  } = useWaitForTransaction({
    hash: data ? data.hash : null,
  });

  const shouldSwitchChain = network && chain.chain !== network.id;

  return (
    <button type="button" disabled={shouldSwitchChain || !account || isLoading || txLoading} className="outline" onClick={write}>
      Collect Fees&nbsp;
      <FontAwesomeIcon icon={faCommentsDollar} />
    </button>
  );
}
