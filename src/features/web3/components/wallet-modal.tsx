"use client";
import { motion } from "framer-motion";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";

import { CloseIcon } from "@/assets/close-icon";

import { shortenString } from "../functions/format";

import styles from "./styles/wallet-form.module.scss";
import { WalletButton } from "./walletButton";

export const WalletModal = ({ onClose }: { onClose: () => void }) => {
  const { data: session } = useSession();
  const { address, isConnected } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { signMessageAsync, isLoading } = useSignMessage();

  const onSignInWithCrypto = useCallback(async () => {
    try {
      // Send the public address to generate a nonce associates with our account
      const response = await fetch("/api/users/generateNonce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session?.user?.name || "",
          publicAddress: address,
        }),
      });
      const responseData: any = await response.json();

      // return in case of Invalid user
      if (response.status === 402) return window.alert(responseData);

      // Sign the received nonce
      const message = new SiweMessage({
        domain: window.location.host,
        uri: window.location.origin,
        version: "1",
        address: `${address}`,
        nonce: responseData.nonce,
        chainId: 11029,
      });

      const signedNonce = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // Use NextAuth to sign in with our address and the nonce
      await signIn("crypto", {
        message: JSON.stringify(message),
        publicAddress: address,
        signedNonce,
        redirect: false,
        callbackUrl: "/",
      });
    } catch {
      toast.error("Error with signing, please try again.");
    }
  }, [address, session?.user?.name, signMessageAsync]);

  const handleConnect = useCallback(
    async (connector: any) => {
      const result = await connectAsync({ connector });

      if (result.account) {
        await onSignInWithCrypto();
      }
    },
    [connectAsync, onSignInWithCrypto],
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
          {address && isConnected ? (
            <AccountDetail
              address={address}
              session={session}
              isLoading={isLoading}
              onSignAndVerify={onSignInWithCrypto}
            />
          ) : (
            <>
              <h2 className={styles.title}>Select a wallet</h2>

              {connectors.map((connector: any) => (
                <div key={connector.id} className={styles.authButtons}>
                  <WalletButton
                    disabled={!connector.ready}
                    onClick={() => handleConnect(connector)}
                    text="Sign in with Metamask"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AccountDetail = ({
  address,
  isLoading,
  session,
  onSignAndVerify,
}: {
  address: string;
  isLoading: boolean;
  session: Session | null;
  onSignAndVerify: () => void;
}): JSX.Element => {
  const { disconnect } = useDisconnect();

  const isExistedAddress = session?.user?.publicAddress === address;

  return (
    <div>
      <div>{shortenString(address, 10)}</div>
      {!session?.user?.publicAddress && (
        <>
          <div>Please verify and sign with your wallet address</div>
          <WalletButton
            onClick={() => onSignAndVerify()}
            text={isLoading ? "Please wait..." : "Sign and Verify"}
          />
        </>
      )}
      {session?.user?.publicAddress && !isExistedAddress && (
        <div>Please switch verified wallet address</div>
      )}
      <WalletButton onClick={() => disconnect()} text="Disconnect" />
    </div>
  );
};
