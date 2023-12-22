"use client";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import numeral from "numeral";
import { useAccount, useBalance } from "wagmi";

import { CloseIcon } from "@/assets/close-icon";

import { shortenString } from "../functions/format";
import useSignVerifyWithCrypto from "../hooks/use-sign-verify";

import { Avatar } from "./avatar";
import CopyButton from "./copy-address-button";
import DisconnectButton from "./disconnect-button";
import styles from "./styles/account-detail.module.scss";
import { WalletButton } from "./walletButton";

const AccountDetailModal = ({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element => {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();

  const balance = useBalance({ address, watch: true });

  const { isFetchingNonce, error, isLoading, onSignInWithCrypto } =
    useSignVerifyWithCrypto();

  const isExistedAddress = session?.user?.publicAddress === address;

  if (!isConnected) return <div>Please connect wallet</div>;

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

        <div>Account Detail</div>

        <div className={styles.placeholder} />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.avatar}>
            <Avatar userImage={session?.user?.profile_image_url} />
          </div>

          <div className={styles.address}>
            {shortenString(address || "", 5)}
          </div>

          <div className={styles.balance}>
            {numeral(balance.data?.formatted || 0).format("0,0.[00]")} CC
          </div>

          {session?.user?.publicAddress !== address && (
            <div className={styles.sign}>
              <div className={styles.warning}>
                Please verify and sign with wallet address
              </div>
              <WalletButton
                isLoading={isLoading || isFetchingNonce}
                onClick={() => onSignInWithCrypto()}
                text={
                  isLoading || isFetchingNonce
                    ? "Please wait..."
                    : "Sign and Verify"
                }
              />
            </div>
          )}
          {session?.user?.publicAddress && !isExistedAddress && (
            <div>Please switch verified wallet address</div>
          )}
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.actions}>
            <CopyButton toCopy={address || ""} />
            <DisconnectButton />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountDetailModal;
