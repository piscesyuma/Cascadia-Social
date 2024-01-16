import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";

import {
  FEEDISTRIBUTOR,
  MAX_LOCK_PERIOD_IN_DAYS,
  VOTINESCROW,
} from "../../../config";

// const cooldownTimestamp = MAX_LOCK_PERIOD_IN_DAYS * 24 * 60 * 60;
const cooldownTimestamp = 600;

export const useUnlockAction = () => {
  const { address } = useAccount();

  const {
    data: startCooldown,
    writeAsync: writeStartCooldown,
    isSuccess: isSuccessWriteStartCooldown,
    isLoading: isLoadingWriteStartCooldown,
  } = useContractWrite({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "start_cooldown",
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    isLoading: isLoadingStartCooldown,
    isSuccess: isSuccessStartCooldown,
  } = useWaitForTransaction({
    hash: startCooldown?.hash,
    enabled: startCooldown && isSuccessWriteStartCooldown,
  });

  const {
    data: withdraw,
    writeAsync: writeWithdraw,
    isSuccess: isSuccessWriteWithdraw,
    isLoading: isLoadingWriteWithdraw,
  } = useContractWrite({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "withdraw",
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const { isLoading: isLoadingWithdraw, isSuccess: isSuccessWithdraw } =
    useWaitForTransaction({
      hash: withdraw?.hash,
      enabled: withdraw && isSuccessWriteWithdraw,
    });

  const {
    data: relock,
    writeAsync: writeRelock,
    isSuccess: isSuccessWriteRelock,
    isLoading: isLoadingWriteRelock,
  } = useContractWrite({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "renew_cooldown",
    args: [cooldownTimestamp],
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const { isLoading: isLoadingRelock, isSuccess: isSuccessRelock } =
    useWaitForTransaction({
      hash: relock?.hash,
      enabled: relock && isSuccessWriteRelock,
    });

  const {
    data: claim,
    writeAsync: writeClaim,
    isSuccess: isSuccessWriteClaim,
    isLoading: isLoadingWriteClaim,
  } = useContractWrite({
    address: FEEDISTRIBUTOR.address as `0x${string}`,
    abi: FEEDISTRIBUTOR.abi,
    functionName: "claim",
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const { isLoading: isLoadingClaim, isSuccess: isSuccessClaim } =
    useWaitForTransaction({
      hash: claim?.hash,
      enabled: claim && isSuccessWriteClaim,
    });

  return {
    startCooldown,
    writeStartCooldown,
    isSuccessWriteStartCooldown,
    isLoadingWriteStartCooldown,
    isLoadingStartCooldown,
    isSuccessStartCooldown,
    withdraw,
    writeWithdraw,
    isSuccessWriteWithdraw,
    isLoadingWriteWithdraw,
    isLoadingWithdraw,
    isSuccessWithdraw,
    relock,
    writeRelock,
    isSuccessWriteRelock,
    isLoadingWriteRelock,
    isLoadingRelock,
    isSuccessRelock,
    claim,
    writeClaim,
    isSuccessWriteClaim,
    isLoadingWriteClaim,
    isLoadingClaim,
    isSuccessClaim,
  };
};
