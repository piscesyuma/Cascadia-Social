import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";

import { FEEDISTRIBUTOR, VOTINESCROW } from "../config";
import { AlignState } from "../types";
import { bnum, formatDateInput, formatLockInfo } from "../utils";

import useLockAmount from "./use-lock-amount";
import useLockEndDate from "./use-lock-date";

const initialState: AlignState = {
  isLoading: true,
  balance: "",
  lockEndDate: "",
  lockAmount: "",
  submissionDisabled: true,
  veCCLockInfo: {
    cooldown: 0,
    lockedEndDate: 0,
    lockedAmount: "",
    totalSupply: "",
    claimStatus: 0,
    epoch: "",
    hasExistingLock: false,
    isExpired: false,
  },
};

export const useAlign = () => {
  const [state, setState] = useState<AlignState>(initialState);

  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
  });
  const { isValidLockAmount, isIncreasedLockAmount } = useLockAmount(
    state.veCCLockInfo,
  );
  const { isValidLockEndDate, isExtendedLockEndDate, maxLockEndDateTimestamp } =
    useLockEndDate(state.veCCLockInfo);

  const { data: locked, refetch: refetchLocked } = useContractRead({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "locked",
    args: [address],
    enabled: !!address,
  });

  const { data: epoch, refetch: refetchEpoch } = useContractRead({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "epoch",
    args: [],
    enabled: !!address,
  });

  const { data: totalSupply, refetch: refetchSupply } = useContractRead({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "supply",
    args: [],
    enabled: !!address,
  });

  const { data: claimStatus, refetch: refetchClaim } = useContractRead({
    address: FEEDISTRIBUTOR.address as `0x${string}`,
    abi: FEEDISTRIBUTOR.abi,
    functionName: "get_user_cCC_status",
    args: [address],
    enabled: !!address,
    watch: true,
  });

  const setLockAmount = useCallback(
    (lockAmount: string) => {
      const amountExceedsTokenBalance = bnum(lockAmount).gt(
        new BigNumber(balance?.formatted || "0"),
      );

      let submissionDisabled =
        !address ||
        !isValidLockAmount(lockAmount) ||
        !isValidLockEndDate(state.lockEndDate) ||
        amountExceedsTokenBalance;

      if (
        state.veCCLockInfo?.hasExistingLock &&
        !state.veCCLockInfo.isExpired
      ) {
        submissionDisabled =
          !isIncreasedLockAmount(lockAmount) &&
          !isExtendedLockEndDate(state.lockEndDate) &&
          !amountExceedsTokenBalance;
      }

      setState((prev) => ({ ...prev, lockAmount, submissionDisabled }));
    },
    [
      balance?.formatted,
      address,
      isValidLockAmount,
      isValidLockEndDate,
      state.lockEndDate,
      state.veCCLockInfo?.hasExistingLock,
      state.veCCLockInfo.isExpired,
      isIncreasedLockAmount,
      isExtendedLockEndDate,
    ],
  );

  const handleGetVeCC = useCallback(() => {
    if (!address || !locked) return;

    const veCCLockInfo = formatLockInfo({
      locked,
      epoch,
      totalSupply,
      claimStatus,
    });

    const lockEndDate = veCCLockInfo?.hasExistingLock
      ? veCCLockInfo?.cooldown > 0
        ? formatDateInput(veCCLockInfo?.cooldown + new Date().getTime())
        : formatDateInput(veCCLockInfo.lockedEndDate)
      : formatDateInput(maxLockEndDateTimestamp);

    setState((prev) => ({
      ...prev,
      isLoading: false,
      lockEndDate,
      veCCLockInfo,
    }));
  }, [
    address,
    claimStatus,
    epoch,
    locked,
    maxLockEndDateTimestamp,
    totalSupply,
  ]);

  const handleRefetch = useCallback(async () => {
    await refetchLocked();
    await refetchEpoch();
    await refetchSupply();
    await refetchClaim();
  }, [refetchClaim, refetchEpoch, refetchLocked, refetchSupply]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      balance: balance?.formatted || "0",
    }));
  }, [balance]);

  return {
    state,
    setState,
    setLockAmount,
    handleGetVeCC,
    handleRefetch,
  };
};
