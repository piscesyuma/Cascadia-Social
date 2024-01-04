"use client";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { useConnect } from "wagmi";

import { CloseIcon } from "@/assets/close-icon";

import styles from "./styles/wallet-form.module.scss";
import { WalletButton } from "./wallet-button";

export const WalletModal = ({ onClose }: { onClose: () => void }) => {
  const { connectors, connectAsync, isLoading, pendingConnector } =
    useConnect();

  const handleConnect = useCallback(
    async (connector: any) => {
      await connectAsync({ connector });
    },
    [connectAsync],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.2 }}
      role="group"
      className={styles.container}
    >
      <div className={styles.header}>
        <button
          onClick={onClose}
          aria-label="Close"
          data-title="Close"
          className={styles.close}
        >
          <CloseIcon />
        </button>

        <div className={styles.placeholder} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h2 className={styles.title}>Select a wallet</h2>

          {connectors.map((connector: any) => (
            <div key={connector.id} className={styles.authButtons}>
              <WalletButton
                disabled={!connector.ready}
                isLoading={isLoading && connector.id === pendingConnector?.id}
                onClick={() => handleConnect(connector)}
                text={`Sign in with ${connector.name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
