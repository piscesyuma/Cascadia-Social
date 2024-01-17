"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { parseEther } from "viem";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";

import { CheckIcon } from "@/assets/check-icon";
import { LoadingCircle } from "@/components/elements/loading-spinner";
import { shortenString } from "@/features/web3";
import { useLockModal } from "@/stores/use-lock-modal";

import { LockType, MAX_LOCK_PERIOD_IN_DAYS, VOTINESCROW } from "../../config";
import { ActionDetailType, ActionStatusType } from "../../types";
import { AlignButton } from "../align-button";

import styles from "./styles/lock-actions.module.scss";

// const cooldownTimestamp = MAX_LOCK_PERIOD_IN_DAYS * 24 * 60 * 60;
const cooldownTimestamp = 600;

export const LockActions = ({
  lockType,
  lockAmount,
  setLockAmount,
  onConfirm,
}: {
  lockType: LockType[] | undefined;
  lockAmount: string;
  setLockAmount: (lockAmount: string) => void;
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

  const isLockModalOpen = useLockModal((state) => state.isLockModalOpen);
  const closeLockModal = useLockModal((state) => state.closeLockModal);

  const {
    data: createLock,
    writeAsync: writeCreateLock,
    isSuccess: isSuccessWriteCreateLock,
    isLoading: isLoadingWriteCreateLock,
  } = useContractWrite({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "create_cooldown_lock",
    args: [cooldownTimestamp],
    account: address,
    value: parseEther(lockAmount),
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const {
    data: increaseLock,
    writeAsync: writeIncreaseLock,
    isSuccess: isSuccessWriteIncreaseLock,
    isLoading: isLoadingWriteIncreaseLock,
  } = useContractWrite({
    address: VOTINESCROW.address as `0x${string}`,
    abi: VOTINESCROW.abi,
    functionName: "increase_amount",
    args: [],
    account: address,
    value: parseEther(lockAmount),
    onSuccess: () => {},
    onError: (err) => {
      console.log(err);
    },
  });

  const { isLoading: isLoadingCreateLock, isSuccess: isSuccessCreateLock } =
    useWaitForTransaction({
      hash: createLock?.hash,
      enabled: createLock && isSuccessWriteCreateLock,
    });

  const { isLoading: isLoadingIncreaseLock, isSuccess: isSuccessIncreaseLock } =
    useWaitForTransaction({
      hash: increaseLock?.hash,
      enabled: increaseLock && isSuccessWriteIncreaseLock,
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
          case LockType.CREATE_LOCK:
            isActive = isSuccessWriteCreateLock && isSuccessCreateLock;
            isLoading = !!isLoadingWriteCreateLock || !!isLoadingCreateLock;
            disabled =
              !address || !!isLoadingWriteCreateLock || !!isLoadingCreateLock;
            onSubmit = writeCreateLock;
            hash = createLock?.hash || "";
            break;
          case LockType.INCREASE_LOCK:
            isActive = isSuccessWriteIncreaseLock && isSuccessIncreaseLock;
            isLoading = !!isLoadingWriteIncreaseLock || !!isLoadingIncreaseLock;
            disabled =
              !address ||
              !!isLoadingWriteIncreaseLock ||
              !!isLoadingIncreaseLock;
            onSubmit = writeIncreaseLock;
            hash = increaseLock?.hash || "";
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
    createLock?.hash,
    increaseLock?.hash,
    isLoadingCreateLock,
    isLoadingIncreaseLock,
    isLoadingWriteCreateLock,
    isLoadingWriteIncreaseLock,
    isSuccessCreateLock,
    isSuccessIncreaseLock,
    isSuccessWriteCreateLock,
    isSuccessWriteIncreaseLock,
  ]);

  useEffect(() => {
    const newActionDetails = lockType?.map((lockType) => {
      let label = "";

      if (lockType === LockType.CREATE_LOCK) {
        label = `Confirm`;
      }
      if (lockType === LockType.EXTEND_LOCK) label = `Confirm`;
      if (lockType === LockType.INCREASE_LOCK) label = `Confirm`;

      return {
        id: lockType,
        label,
      };
    });

    newActionDetails && setActionDetails(newActionDetails);
  }, [lockType]);

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
  }, [actionsStatus, currentActionIndex, currentActionStatus, isLockModalOpen]);

  useEffect(() => {
    if (lastActionState?.isActive) {
      onConfirm();
    }
  }, [lastActionState, onConfirm]);

  useEffect(() => {
    setCurrentActionIndex(0);
  }, [isLockModalOpen]);

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        {actionsStatus.length > 1 &&
          actionsStatus.map((status: ActionStatusType, index: number) => (
            <div key={index} className={styles.actionItem}>
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
        <AlignButton
          text="Confirm"
          onClick={handleSubmit}
          isLoading={currentActionStatus?.isLoading}
          disabled={currentActionStatus?.disabled}
        />
      ) : (
        <AlignButton
          text="Done"
          onClick={() => {
            setLockAmount("0");
            closeLockModal();
          }}
        />
      )}
    </div>
  );
};
