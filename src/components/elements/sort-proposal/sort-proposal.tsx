"use client";
import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

import { CheckIcon } from "@/assets/check-icon";
import { Gear } from "@/assets/gear-icon";
import { Menu, MenuItem } from "@/components/elements/menu";
import { Modal } from "@/components/elements/modal";
import { useProposalVersion } from "@/stores/use-proposal-version";

import styles from "./styles/sort-proposal.module.scss";

export const SortProposal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const version = useProposalVersion((state) => state.version);
  const setVersion = useProposalVersion((state) => state.setVersion);

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        aria-expanded={isModalOpen}
        aria-haspopup="menu"
        aria-label="Sort Proposal"
        data-title="Sort Proposal"
        tabIndex={0}
        onClick={() => setIsModalOpen(true)}
        className={styles.sortButton}
      >
        <Gear />
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)} background="none">
            <Menu onClose={() => setIsModalOpen(false)} ref={buttonRef}>
              <MenuItem
                onClick={() => {
                  setVersion("active");
                  setIsModalOpen(false);
                }}
              >
                Active
                {version === "active" && <CheckIcon />}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setVersion("archive");
                  setIsModalOpen(false);
                }}
              >
                Archive
                {version === "archive" && <CheckIcon />}
              </MenuItem>
            </Menu>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
