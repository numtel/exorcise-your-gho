import { useAccount, useNetwork, useSwitchNetwork, useContractWrite, useWaitForTransaction } from 'wagmi';

export default function Transaction({writeArgs, submitText, disabled}) {
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

  const shouldSwitchChain = chain && Number(writeArgs.chainId) !== chain.id;
  return (<div>
    {shouldSwitchChain ?
      <button type="button" disabled={disabled || !account} onClick={() => switchNetwork(writeArgs.chain)}>Switch Chain</button>
      : <button type="button" disabled={disabled || !account || isLoading || txLoading} onClick={() => write()}>{submitText}</button>}
    {isLoading && <p className="form-status">Waiting for user...</p>}
    {isError && <p className="form-status error">Transaction error!</p>}
    {isSuccess && (
      txError ? (<p className="form-status error">Transaction error!</p>)
      : txLoading ? (<p className="form-status">Waiting for transaction...</p>)
      : txSuccess ? (<p className="form-status">Success!</p>)
      : (<p className="form-status">Transaction sent...</p>))}
  </div>);
}

