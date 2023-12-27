import { HamburgerButton } from "@/components/elements/hamburger-button";
import { SortProposal } from "@/components/elements/sort-proposal";

import { HeaderHeading } from "./header-heading";
import styles from "./styles/governance-header.module.scss";

export const GovernanceHeader = () => {
  return (
    <div className={styles.container}>
      <HamburgerButton />
      <HeaderHeading title="Governance" />

      <div className={styles.type}>
        <SortProposal />
      </div>
    </div>
  );
};
