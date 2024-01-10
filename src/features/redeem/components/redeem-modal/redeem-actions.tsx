"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { parseEther } from "viem";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { CheckIcon } from "@/assets/check-icon";
import { LoadingCircle } from "@/components/elements/loading-spinner";
import { Tooltip } from "@/components/elements/tooltip";
import { shortenString } from "@/features/web3";
import { useRedeemModal } from "@/stores/use-redeem-modal";

import { CCC, FEEDISTRIBUTOR, REDEEM, RedeemType, WETH } from "../../config";
import { ActionDetailType, ActionStatusType } from "../../types";
import { bnum } from "../../utils";
import { RedeemButton } from "../redeem-button";

import styles from "./styles/redeem-actions.module.scss";

export const RedeemActions = ({
  redeemType,
  amount,
  wETHAmount,
  setAmount,
  onConfirm,
}: {
  redeemType: RedeemType[] | undefined;
  amount: string;
  wETHAmount: string;
  setAmount: (lockAmount: string) => void;
  onConfirm: () => void;
}) => {
  const [actionDetails, setActionDetails] = useState<ActionDetailType[]>([]);
  const [actionsStatus, setActionsStatus] = useState<ActionStatusType[]>([]);
  const [currentActionIndex, setCurrentActionIndex] = useState<number>(0);
  const [currentActionStatus, setCurrentActionStatus] =
    useState<ActionStatusType>();

  const lastActionState = useMemo(
    () => actionsStatus[actionsStatus.length - 1],
    [actionsStatus],
  );

  const { address } = useAccount();

  const isRedeemModalOpen = useRedeemModal((state) => state.isRedeemModalOpen);
  const closeRedeemModal = useRedeemModal((state) => state.closeRedeemModal);

  const { data: cCCAllowanceRedeem } = useContractRead({
    address: CCC.address as `0x${string}`,
    abi: CCC.abi,
    functionName: "allowance",
    args: [address, REDEEM.address],
    enabled: !!address,
    watch: true,
  });

  const { data: cCCAllowanceFee } = useContractRead({
    address: CCC.address as `0x${string}`,
    abi: CCC.abi,
    functionName: "allowance",
    args: [address, FEEDISTRIBUTOR.address],
    enabled: !!address,
    watch: true,
  });

  const { data: wETHAllowance } = useContractRead({
    address: WETH.address as `0x${string}`,
    abi: WETH.abi,
    functionName: "allowance",
    args: [address, REDEEM.address],
    enabled: !!address,
    watch: true,
  });

  const {
    data: approveCCCRedeem,
    writeAsync: writeApproveCCCRedeem,
    isSuccess: isSuccessWriteApproveCCCRedeem,
    isLoading: isLoadingWriteApproveCCCRedeem,
  } = useContractWrite({
    address: CCC.address as `0x${string}`,
    abi: CCC.abi,
    functionName: "approve",
    args: [REDEEM.address, parseEther(amount)],
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    isLoading: isLoadingApproveCCCRedeem,
    isSuccess: isSuccessApproveCCCRedeem,
  } = useWaitForTransaction({
    hash: approveCCCRedeem?.hash,
    enabled: approveCCCRedeem && isSuccessWriteApproveCCCRedeem,
  });

  const {
    data: approveCCCFee,
    writeAsync: writeApproveCCCFee,
    isSuccess: isSuccessWriteApproveCCCFee,
    isLoading: isLoadingWriteApproveCCCFee,
  } = useContractWrite({
    address: CCC.address as `0x${string}`,
    abi: CCC.abi,
    functionName: "approve",
    args: [FEEDISTRIBUTOR.address, parseEther(amount)],
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    isLoading: isLoadingApproveCCCFee,
    isSuccess: isSuccessApproveCCCFee,
  } = useWaitForTransaction({
    hash: approveCCCFee?.hash,
    enabled: approveCCCFee && isSuccessWriteApproveCCCFee,
  });

  const {
    data: approveWETH,
    writeAsync: writeApproveWETH,
    isSuccess: isSuccessWriteApproveWETH,
    isLoading: isLoadingWriteApproveWETH,
  } = useContractWrite({
    address: WETH.address as `0x${string}`,
    abi: WETH.abi,
    functionName: "approve",
    args: [REDEEM.address, parseEther(wETHAmount)],
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const { isLoading: isLoadingApproveWETH, isSuccess: isSuccessApproveWETH } =
    useWaitForTransaction({
      hash: approveWETH?.hash,
      enabled: approveWETH && isSuccessWriteApproveWETH,
    });

  const {
    data: redeem,
    writeAsync: writeRedeem,
    isSuccess: isSuccessWriteRedeem,
    isLoading: isLoadingWriteRedeem,
  } = useContractWrite({
    address: REDEEM.address as `0x${string}`,
    abi: REDEEM.abi,
    functionName: "redeemCCToken",
    args: [parseEther(amount)],
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const { isLoading: isLoadingRedeem, isSuccess: isSuccessRedeem } =
    useWaitForTransaction({
      hash: redeem?.hash,
      enabled: redeem && isSuccessWriteRedeem,
    });

  const {
    data: burn,
    writeAsync: writeBurn,
    isSuccess: isSuccessWriteBurn,
    isLoading: isLoadingWriteBurn,
  } = useContractWrite({
    address: FEEDISTRIBUTOR.address as `0x${string}`,
    abi: FEEDISTRIBUTOR.abi,
    functionName: "burn",
    args: [parseEther(amount)],
    account: address,
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const { isLoading: isLoadingBurn, isSuccess: isSuccessBurn } =
    useWaitForTransaction({
      hash: burn?.hash,
      enabled: burn && isSuccessWriteBurn,
    });

  const handleSubmit = useCallback(() => {
    if (currentActionStatus?.isActive) {
      setCurrentActionIndex((prev) => prev + 1);
    } else {
      currentActionStatus?.onSubmit().catch(() => {
        toast.warning("Canceled Metamask.");
      });
    }
  }, [currentActionStatus]);

  useEffect(() => {
    const newActionsStatus: ActionStatusType[] = actionDetails.map(
      (actionDetail) => {
        let isActive = false;
        let disabled = false;
        let isLoading = false;
        let onSubmit;
        let hash;

        switch (actionDetail.id) {
          case RedeemType.APPROVE_CCC_REDEEM:
            isActive =
              (cCCAllowanceRedeem &&
                bnum(cCCAllowanceRedeem.toString()).gt(
                  parseEther(amount).toString(),
                )) ||
              (isSuccessWriteApproveCCCRedeem && isSuccessApproveCCCRedeem);
            isLoading =
              !!isLoadingWriteApproveCCCRedeem || !!isLoadingApproveCCCRedeem;
            disabled =
              !address ||
              !!isLoadingWriteApproveCCCRedeem ||
              !!isLoadingApproveCCCRedeem;
            onSubmit = writeApproveCCCRedeem;
            hash = approveCCCRedeem?.hash || "";
            break;
          case RedeemType.APPROVE_CCC_FEE:
            isActive =
              (cCCAllowanceFee &&
                bnum(cCCAllowanceFee.toString()).gt(
                  parseEther(amount).toString(),
                )) ||
              (isSuccessWriteApproveCCCFee && isSuccessApproveCCCFee);
            isLoading =
              !!isLoadingWriteApproveCCCFee || !!isLoadingApproveCCCFee;
            disabled =
              !address ||
              !!isLoadingWriteApproveCCCFee ||
              !!isLoadingApproveCCCFee;
            onSubmit = writeApproveCCCFee;
            hash = approveCCCFee?.hash || "";
            break;
          case RedeemType.APPROVE_WETH:
            isActive =
              (wETHAllowance &&
                bnum(wETHAllowance.toString()).gt(
                  parseEther(wETHAmount).toString(),
                )) ||
              (isSuccessWriteApproveWETH && isSuccessApproveWETH);
            isLoading = !!isLoadingWriteApproveWETH || !!isLoadingApproveWETH;
            disabled =
              !address || !!isLoadingWriteApproveWETH || !!isLoadingApproveWETH;
            onSubmit = writeApproveWETH;
            hash = approveWETH?.hash || "";
            break;
          case RedeemType.REDEEM:
            isActive = isSuccessWriteRedeem && isSuccessRedeem;
            isLoading = !!isLoadingWriteRedeem || !!isLoadingRedeem;
            disabled = !address || !!isLoadingWriteRedeem || !!isLoadingRedeem;
            onSubmit = writeRedeem;
            hash = redeem?.hash || "";
            break;
          case RedeemType.BURN:
            isActive = isSuccessWriteBurn && isSuccessBurn;
            isLoading = !!isLoadingWriteBurn || !!isLoadingBurn;
            disabled = !address || !!isLoadingWriteBurn || !!isLoadingBurn;
            onSubmit = writeBurn;
            hash = burn?.hash || "";
            break;
          default:
            break;
        }

        return {
          ...actionDetail,
          isActive,
          isLoading,
          disabled,
          onSubmit,
          hash,
        };
      },
    );

    setActionsStatus(newActionsStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actionDetails,
    address,
    cCCAllowanceRedeem,
    wETHAllowance,
    redeem?.hash,
    isLoadingWriteRedeem,
    isSuccessWriteRedeem,
    isSuccessRedeem,
    isLoadingRedeem,
    isSuccessWriteApproveCCCRedeem,
    isSuccessApproveCCCRedeem,
    isLoadingWriteApproveCCCRedeem,
    isLoadingApproveCCCRedeem,
    approveCCCRedeem?.hash,
    amount,
    wETHAmount,
    isSuccessWriteApproveWETH,
    isSuccessApproveWETH,
    isLoadingWriteApproveWETH,
    isLoadingApproveWETH,
    approveWETH?.hash,
    isSuccessWriteBurn,
    isSuccessBurn,
    isLoadingWriteBurn,
    isLoadingBurn,
    burn?.hash,
    cCCAllowanceFee,
    isSuccessWriteApproveCCCFee,
    isSuccessApproveCCCFee,
    isLoadingWriteApproveCCCFee,
    isLoadingApproveCCCFee,
    approveCCCFee?.hash,
  ]);

  useEffect(() => {
    const newActionDetails = redeemType?.map((_redeemType) => {
      let label = "";
      let tooltip = "";

      switch (_redeemType) {
        case RedeemType.APPROVE_CCC_REDEEM:
          label = "Approve cCC Token";
          tooltip = "Approve cCC token on Redeem Contract";
          break;

        case RedeemType.APPROVE_CCC_FEE:
          label = "Approve cCC Token";
          tooltip = "Approve cCC token on Fee Distributor Contract";
          break;

        case RedeemType.APPROVE_WETH:
          label = "Approve wETH Token";
          tooltip = "Approve wETH Token";
          break;

        case RedeemType.REDEEM:
          label = "Confirm";
          tooltip = "Confirm Redeem";
          break;

        case RedeemType.BURN:
          label = "Confirm";
          tooltip = "Confirm Burn";
          break;

        default:
          break;
      }

      return {
        id: _redeemType,
        label,
        tooltip,
      };
    });

    newActionDetails && setActionDetails(newActionDetails);
  }, [redeemType]);

  useEffect(() => {
    if (actionsStatus.length) {
      const current = actionsStatus[currentActionIndex];

      const max = actionsStatus.length - 1;
      const nextActionIndex = currentActionIndex + 1;
      const newIndex = nextActionIndex > max ? max : nextActionIndex;

      if (current.isActive && newIndex !== currentActionIndex) {
        setCurrentActionIndex(newIndex);
      } else {
        setCurrentActionStatus(current);
      }
    }
  }, [
    actionsStatus,
    currentActionIndex,
    currentActionStatus,
    isRedeemModalOpen,
  ]);

  useEffect(() => {
    if (lastActionState?.isActive) {
      onConfirm();
    }
  }, [lastActionState, onConfirm]);

  useEffect(() => {
    setCurrentActionIndex(0);
  }, [isRedeemModalOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        {actionsStatus.map((status: ActionStatusType, index: number) => (
          <div key={index} className={styles.actionItem}>
            <Tooltip text={status.tooltip}>
              {!status.isActive && (
                <div className={styles.inActive}>{index + 1}</div>
              )}
              {status.isActive && (
                <div className={styles.active}>
                  <CheckIcon />
                </div>
              )}
              {status.isLoading && (
                <div className={styles.loading}>
                  <LoadingCircle size="40px" strokewidth={1} />
                </div>
              )}
            </Tooltip>
          </div>
        ))}
      </div>

      {actionsStatus.map((status: ActionStatusType, index: number) => (
        <React.Fragment key={index}>
          {status.hash && status.isActive && (
            <div key={index} className={styles.hash}>
              <div>Trasanction ID</div>
              <Link
                href={`https://explorer.cascadia.foundation/tx/${status.hash}`}
                target="_blank"
              >
                <div>{shortenString(status.hash, 12)}</div>
              </Link>
            </div>
          )}
        </React.Fragment>
      ))}

      {!lastActionState?.isActive ? (
        <RedeemButton
          text={currentActionStatus?.label}
          onClick={handleSubmit}
          isLoading={currentActionStatus?.isLoading}
          disabled={currentActionStatus?.disabled}
        />
      ) : (
        <RedeemButton
          text="Done"
          onClick={() => {
            setAmount("0");
            closeRedeemModal();
          }}
        />
      )}
    </div>
  );
};
