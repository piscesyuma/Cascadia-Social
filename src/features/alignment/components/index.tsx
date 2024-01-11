"use client";
import { useState } from "react";
import { useAccount } from "wagmi";

import { Balance } from "./balance";
import { AddAlignment } from "./form";
import styles from "./styles/index.module.scss";
import { UnLockAlignment } from "./unlock-form";

export const Alignment = () => {
  const { address } = useAccount();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <section aria-label="alignment" className={styles.container}>
      {selectedTab === 0 ? (
        <Balance changeTab={() => setSelectedTab(1)} />
      ) : (
        <>
          <AddAlignment changeTab={() => setSelectedTab(0)} />
          {address && <div className={styles.divider}></div>}
          <UnLockAlignment />
        </>
      )}
    </section>
  );
};
