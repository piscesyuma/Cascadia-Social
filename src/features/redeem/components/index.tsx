"use client";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { Modal } from "@/components/elements/modal";
import useHasMounted from "@/hooks/use-mounted";
import { useRedeemModal } from "@/stores/use-redeem-modal";

import { RedeemType } from "../config";
import { useRedeem } from "../hooks/use-redeem";
import { bnum } from "../utils";

import { Amount } from "./amount";
import { Price } from "./price";
import { RedeemButton } from "./redeem-button";
import { RedeemModal } from "./redeem-modal";
import styles from "./styles/index.module.scss";

export const Redeem = () => {
  const hasMounted = useHasMounted();

  const { address } = useAccount();

  const { state, setAmount, handleGetRedeem } = useRedeem();

  const isRedeemModalOpen = useRedeemModal((state) => state.isRedeemModalOpen);
  const openRedeemModal = useRedeemModal((state) => state.openRedeemModal);
  const closeRedeemModal = useRedeemModal((state) => state.closeRedeemModal);

  const [redeemType, setRedeemType] = useState<RedeemType[]>();

  const { amount, wETHAmount, redeemInfo } = state;

  const amountExceedsCCCTokenBalance = bnum(amount).gt(redeemInfo.cCCBalance);
  const amountExceedsWETHTokenBalance = bnum(wETHAmount).gt(
    redeemInfo.wETHBalance,
  );

  const isMaxAmount =
    bnum(amount).gt(0) && bnum(amount).eq(redeemInfo.cCCBalance);

  const handleOpenModal = useCallback(
    ({
      isBurn = false,
      isMaxAmount = false,
    }: {
      isBurn?: boolean;
      isMaxAmount?: boolean;
    }) => {
      const newRedeemType = () => {
        if (isBurn) {
          return [RedeemType.APPROVE_CCC_FEE, RedeemType.BURN];
        }

        if (redeemInfo.claimStatus === 2) {
          return [
            RedeemType.APPROVE_CCC_REDEEM,
            RedeemType.APPROVE_WETH,
            isMaxAmount ? RedeemType.REDEEMALL : RedeemType.REDEEM,
          ];
        } else if (redeemInfo.claimStatus === 1) {
          return [
            RedeemType.APPROVE_CCC_FEE,
            isMaxAmount ? RedeemType.BURNALL : RedeemType.BURN,
          ];
        }
        return [];
      };

      if (JSON.stringify(newRedeemType()) !== JSON.stringify(redeemType)) {
        setRedeemType(newRedeemType);
      }

      openRedeemModal();
    },
    [openRedeemModal, redeemInfo.claimStatus, redeemType],
  );

  useEffect(() => {
    handleGetRedeem();
  }, [handleGetRedeem]);

  if (!hasMounted) return <div></div>;

  return (
    <section aria-label="redeem" className={styles.container}>
      <Amount state={state} setAmount={setAmount} />

      <Price state={state} />

      {redeemInfo.claimStatus === 1 && (
        <div className={styles.error}>
          cCC token claim has expired. Please burn cCC.
        </div>
      )}

      <div className={styles.actions}>
        {address ? (
          <>
            {redeemInfo.claimStatus !== 1 && (
              <RedeemButton
                text={isMaxAmount ? "Convert All" : "Convert"}
                disabled={
                  state.redeemInfo.claimStatus !== 2 ||
                  amountExceedsCCCTokenBalance ||
                  amountExceedsWETHTokenBalance ||
                  !bnum(amount).gt(0) ||
                  !bnum(wETHAmount).gt(0)
                }
                onClick={() => handleOpenModal({ isMaxAmount })}
              />
            )}
            <RedeemButton
              text={isMaxAmount ? "Burn All" : "Burn"}
              disabled={amountExceedsCCCTokenBalance || !bnum(amount).gt(0)}
              onClick={() => handleOpenModal({ isBurn: true, isMaxAmount })}
            />
          </>
        ) : (
          <div className={styles.connect}>Please connect your wallet.</div>
        )}
      </div>

      <AnimatePresence>
        {isRedeemModalOpen && (
          <Modal
            onClose={closeRedeemModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <RedeemModal
              state={state}
              setAmount={setAmount}
              redeemType={redeemType}
              onGetRedeem={handleGetRedeem}
              onClose={closeRedeemModal}
            />
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
};
