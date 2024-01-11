"use client";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useAccount } from "wagmi";

import { BackArrowIcon } from "@/assets/back-arrow-icon";
import { Modal } from "@/components/elements/modal";
import useHasMounted from "@/hooks/use-mounted";
import { useLockModal } from "@/stores/use-lock-modal";

import { useAlign } from "../hooks/use-align";
import { bnum } from "../utils";

import { AlignButton } from "./align-button";
import { LockAmount } from "./lock-amount";
import { LockModal } from "./lock-modal";
import styles from "./styles/form.module.scss";

export const AddAlignment = ({ changeTab }: { changeTab: () => void }) => {
  const hasMounted = useHasMounted();
  const { address } = useAccount();

  const isLockModalOpen = useLockModal((state) => state.isLockModalOpen);
  const openLockModal = useLockModal((state) => state.openLockModal);
  const closeLockModal = useLockModal((state) => state.closeLockModal);

  const { state, setLockAmount, handleGetVeCC } = useAlign();

  const { lockAmount, balance } = state;

  const amountExceedsTokenBalance = bnum(lockAmount).gt(balance);

  useEffect(() => {
    handleGetVeCC();
  }, [handleGetVeCC]);

  if (!hasMounted) return <div></div>;

  return (
    <section aria-label="add-alignment" className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => changeTab()}>
          <BackArrowIcon />
        </button>
      </div>

      <LockAmount state={state} setLockAmount={setLockAmount} />

      <div className={styles.actions}>
        {address ? (
          <AlignButton
            disabled={state.submissionDisabled || amountExceedsTokenBalance}
            onClick={() => openLockModal()}
          />
        ) : (
          <div className={styles.connect}>Please connect your wallet.</div>
        )}
      </div>

      <AnimatePresence>
        {isLockModalOpen && (
          <Modal
            onClose={closeLockModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <LockModal
              state={state}
              setLockAmount={setLockAmount}
              onGetVeCC={handleGetVeCC}
              onClose={closeLockModal}
            />
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
};
