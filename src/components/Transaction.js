import { useAccount, useNetwork, useSwitchNetwork, useContractWrite, useWaitForTransaction } from 'wagmi';

export default function Transaction({writeArgs, submitText}) {
  const { address: account } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const {data, isLoading, isError, isSuccess, write} = useContractWrite(writeArgs);
  const {
    isError: txError,
    isLoading: txLoading,
    isSuccess: txSuccess
  } = useWaitForTransaction({
    hash: data ? data.hash : null,
  });

  const shouldSwitchChain = chain && Number(writeArgs.chain) !== chain.id;
  return (<div>
    {isLoading && <p className="form-status">Waiting for user confirmation...</p>}
    {isError && <p className="form-status error">Transaction error!</p>}
    {isSuccess && (
      txError ? (<p className="form-status error">Transaction error!</p>)
      : txLoading ? (<p className="form-status">Waiting for transaction...</p>)
      : txSuccess ? (<p className="form-status">Success!</p>)
      : (<p className="form-status">Transaction sent...</p>))}
    {shouldSwitchChain ?
      <button type="button" disabled={!account} onClick={() => switchNetwork(writeArgs.chain)}>Switch Chain</button>
      : <button type="button" disabled={!account || isLoading || txLoading} onClick={() => write()}>{submitText}</button>}
  </div>);
}

