"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import { Alignment } from "@/features/alignment";
import { RegisterForm } from "@/features/auth";
import { Connect } from "@/features/connect";
import { Footer } from "@/features/footer";
import { Search } from "@/features/search";
import { Trends } from "@/features/trends";
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
          {pathname !== "/" &&
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
          )}
          <div className={styles.connectWallet}>
            <ConnectWalletButton text="Connect Wallet" />
          </div>
        </>
      )}
      {!session && (
        <div className={styles.registerForm}>
          <RegisterForm />
        </div>
      )}

      <div className={styles.footer}>
        <Footer />
      </div>

      {session && (
        <div className={styles.alignment}>
          <Alignment />
        </div>
      )}
    </aside>
  );
};
