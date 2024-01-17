"use client";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

import { CheckIcon } from "@/assets/check-icon";
import { LoadingCircle } from "@/components/elements/loading-spinner";
import { shortenString } from "@/features/web3";
import { useUnLockModal } from "@/stores/use-unlock-modal";

import { UnLockType } from "../../config";
import { ActionDetailType, ActionStatusType } from "../../types";
import { AlignButton } from "../align-button";

import { useUnlockAction } from "./hooks/use-unlock-action";
import styles from "./styles/unlock-actions.module.scss";

export const UnLockActions = ({
  unlockType,
  onConfirm,
}: {
  unlockType: UnLockType[] | undefined;
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

  const isUnLockModalOpen = useUnLockModal((state) => state.isUnLockModalOpen);
  const closeUnLockModal = useUnLockModal((state) => state.closeUnLockModal);

  const actions = useUnlockAction();

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
          case UnLockType.START_COOLDOWN:
            isActive =
              actions.isSuccessWriteStartCooldown &&
              actions.isSuccessStartCooldown;
            isLoading =
              !!actions.isLoadingWriteStartCooldown ||
              !!actions.isLoadingStartCooldown;
            disabled =
              !address ||
              !!actions.isLoadingWriteStartCooldown ||
              !!actions.isLoadingStartCooldown;
            onSubmit = actions.writeStartCooldown;
            hash = actions.startCooldown?.hash || "";
            break;

          case UnLockType.WITHDRAW:
            isActive =
              actions.isSuccessWriteWithdraw && actions.isSuccessWithdraw;
            isLoading =
              !!actions.isLoadingWriteWithdraw || !!actions.isLoadingWithdraw;
            disabled =
              !address ||
              !!actions.isLoadingWriteWithdraw ||
              !!actions.isLoadingWithdraw;
            onSubmit = actions.writeWithdraw;
            hash = actions.withdraw?.hash || "";
            break;

          case UnLockType.RELOCK:
            isActive = actions.isSuccessWriteRelock && actions.isSuccessRelock;
            isLoading =
              !!actions.isLoadingWriteRelock || !!actions.isLoadingRelock;
            disabled =
              !address ||
              !!actions.isLoadingWriteRelock ||
              !!actions.isLoadingRelock;
            onSubmit = actions.writeRelock;
            hash = actions.relock?.hash || "";
            break;

          case UnLockType.CLAIM:
            isActive = actions.isSuccessWriteClaim && actions.isSuccessClaim;
            isLoading =
              !!actions.isLoadingWriteClaim || !!actions.isLoadingClaim;
            disabled =
              !address ||
              !!actions.isLoadingWriteClaim ||
              !!actions.isLoadingClaim;
            onSubmit = actions.writeClaim;
            hash = actions.claim?.hash || "";
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
    actions.isSuccessWriteStartCooldown,
    actions.isSuccessStartCooldown,
    actions.isLoadingWriteStartCooldown,
    actions.isLoadingStartCooldown,
    actions.startCooldown?.hash,
    actions.isSuccessWriteWithdraw,
    actions.isSuccessWithdraw,
    actions.isLoadingWriteWithdraw,
    actions.isLoadingWithdraw,
    actions.withdraw?.hash,
    actions.isSuccessWriteRelock,
    actions.isSuccessRelock,
    actions.isLoadingWriteRelock,
    actions.isLoadingRelock,
    actions.relock?.hash,
    actions.isSuccessWriteClaim,
    actions.isSuccessClaim,
    actions.isLoadingWriteClaim,
    actions.isLoadingClaim,
    actions.claim?.hash,
  ]);

  useEffect(() => {
    const newActionDetails = unlockType?.map((unlockType) => {
      const label = "Confirm";

      return {
        id: unlockType,
        label,
      };
    });

    newActionDetails && setActionDetails(newActionDetails);
  }, [unlockType]);

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
    isUnLockModalOpen,
  ]);

  useEffect(() => {
    if (lastActionState?.isActive) {
      onConfirm();
    }
  }, [lastActionState, onConfirm]);

  useEffect(() => {
    setCurrentActionIndex(0);
  }, [isUnLockModalOpen]);

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
            closeUnLockModal();
          }}
        />
      )}
    </div>
  );
};
