import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useContractReads } from "wagmi";

import { FEEDISTRIBUTOR, REDEEM } from "../config";
import { RedeemState } from "../types";
import { bnum, formatRedeem, getWETHFromCC } from "../utils";

const initialState: RedeemState = {
  isLoading: true,
  amount: "",
  wETHAmount: "",
  redeemInfo: {
    claimStatus: 0,
    cCCBalance: "",
    wETHBalance: "",
    ccPrice: "",
    wETHPrice: "",
    discount: "",
  },
};

export const useRedeem = () => {
  const [state, setState] = useState<RedeemState>(initialState);

  const { address } = useAccount();

  const feeContract = {
    address: FEEDISTRIBUTOR.address as `0x${string}`,
    abi: FEEDISTRIBUTOR.abi,
  } as const;

  const redeemContract = {
    address: REDEEM.address as `0x${string}`,
    abi: REDEEM.abi,
  } as const;

  const { data, refetch } = useContractReads({
    enabled: !!address,
    watch: true,
    contracts: [
      {
        ...feeContract,
        functionName: "get_user_cCC_status",
        args: [address],
      },
      {
        ...redeemContract,
        functionName: "getcCCTokenBalance",
        args: [address],
      },
      {
        ...redeemContract,
        functionName: "getWETHTokenBalance",
        args: [address],
      },
      {
        ...redeemContract,
        functionName: "getCCTokenPrice",
      },
      {
        ...redeemContract,
        functionName: "getWETHTokenPrice",
      },
      {
        ...redeemContract,
        functionName: "discount",
      },
    ],
  });

  const setAmount = useCallback(
    (amount: string) => {
      const amountExceedsTokenBalance = bnum(amount).gt(
        new BigNumber(state.redeemInfo.cCCBalance || "0"),
      );

      const submissionDisabled = !address || amountExceedsTokenBalance;

      setState((prev) => ({
        ...prev,
        amount,
        submissionDisabled,
      }));
    },
    [address, state.redeemInfo.cCCBalance],
  );

  const handleGetRedeem = useCallback(() => {
    if (!address || !data) return;

    const redeemInfo = formatRedeem({ data });

    setState((prev) => ({
      ...prev,
      isLoading: false,
      redeemInfo,
    }));
  }, [address, data]);

  const handleRefetch = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    const wETHAmount = getWETHFromCC({
      amount: state.amount,
      ccPrice: state.redeemInfo.ccPrice,
      wETHPrice: state.redeemInfo.wETHPrice,
      discount: state.redeemInfo.discount,
    });

    setState((prev) => ({
      ...prev,
      wETHAmount,
    }));
  }, [
    state.amount,
    state.redeemInfo.ccPrice,
    state.redeemInfo.discount,
    state.redeemInfo.wETHPrice,
  ]);

  return {
    state,
    setState,
    setAmount,
    handleGetRedeem,
    handleRefetch,
  };
};
