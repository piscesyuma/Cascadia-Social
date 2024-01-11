"use client";
import { Governance } from "@/features/governance";
import { GovernanceHeader, Header } from "@/features/header";

import styles from "./styles/governance.module.scss";

export const GovernanceClientPage = () => {
  return (
    <div className={styles.container}>
      <Header>
        <GovernanceHeader />
      </Header>

      <Governance />
    </div>
  );
};
