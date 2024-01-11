"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Alignment } from "@/features/alignment";
import { RegisterForm } from "@/features/auth";
import { Faucet } from "@/features/faucet";
import { Redeem } from "@/features/redeem";
import { Search } from "@/features/search";
import { ConnectWalletButton } from "@/features/web3";

import styles from "./styles/aside.module.scss";

export const Aside = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className={styles.container}>
      {session && (
        <>
          {pathname !== "/" &&
            pathname !== "/explore" &&
            pathname?.split("/")[1] !== "search" && (
              <div className={styles.search}>
                <Search />
              </div>
            )}
          {/* Disabled connect section temporarily */}
          {/* {pathname !== "/" &&
            pathname !== "/explore" &&
            pathname !== "/trends" && (
              <div className={styles.trends}>
                <Trends />
              </div>
            )}
          {pathname !== `/people` && (
            <div className={styles.connect}>
              <Connect />
            </div>
          )} */}
          <div className={styles.connectWallet}>
            <ConnectWalletButton text="Connect Wallet" />
          </div>

          <div className={styles.faucet}>
            <Faucet />
          </div>

          <div className={styles.alignment}>
            <Alignment />
          </div>

          <div className={styles.redeem}>
            <Redeem />
          </div>
        </>
      )}
      {!session && (
        <div className={styles.registerForm}>
          <RegisterForm />
        </div>
      )}
    </aside>
  );
};
