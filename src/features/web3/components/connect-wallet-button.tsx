"use client";
import { AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";

import { Modal } from "@/components/elements/modal";
import { useWalletModal } from "@/stores/use-wallet-modal";

import { shortenString } from "../functions/format";

import styles from "./styles/connect-wallet-button.module.scss";
import { WalletModal } from "./wallet-modal";

export const ConnectWalletButton = ({
  icon,
  text = "Connect Wallet",
}: {
  icon?: React.ReactNode;
  text: string;
}) => {
  const { address } = useAccount();
  const isWalletModalOpen = useWalletModal((state) => state.isWalletModalOpen);
  const openWalletModal = useWalletModal((state) => state.openWalletModal);
  const closeWalletModal = useWalletModal((state) => state.closeWalletModal);

  return (
    <>
      <button
        aria-label="Wallet"
        data-title="Wallet"
        onClick={() => {
          openWalletModal();
        }}
        className={styles.container}
      >
        {address ? (
          <span>{shortenString(address, 10)}</span>
        ) : (
          <>
            {icon}
            {text}
          </>
        )}
      </button>

      <AnimatePresence>
        {isWalletModalOpen && (
          <Modal
            onClose={closeWalletModal}
            disableScroll={true}
            background="var(--clr-modal-background)"
            focusOnElement={`textarea`}
          >
            <WalletModal onClose={closeWalletModal} />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};
