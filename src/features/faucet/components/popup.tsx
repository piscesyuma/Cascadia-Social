import { motion } from "framer-motion";
import Link from "next/link";

import { CloseIcon } from "@/assets/close-icon";

import styles from "./styles/popup.module.scss";

export const Popup = ({ onClose }: { onClose: () => void }) => {
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
      </div>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          TCC has been deposited to your wallet.
          <Link
            type="button"
            onClick={onClose}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              "It’s always darkest before dawn.\n\nJoin us, as we build the future @CascadiaSystems.\n\nhttps://faucet.cascadia.foundation",
            )}`}
            passHref
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              id="twitter"
            >
              <g data-name="<Group>">
                <path
                  fill="white"
                  stroke="#303c42"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 3.5a13.62 13.62 0 0 0 10 5c-.26-1.06-.28-3.94 1.74-5.14a5.24 5.24 0 0 1 2.76-.86A4.65 4.65 0 0 1 19.91 4a10.5 10.5 0 0 0 3-1.14 4.57 4.57 0 0 1-2 2.57 8.77 8.77 0 0 0 2.66-.66 9.3 9.3 0 0 1-2.38 2.43c.71 6.37-5 14.29-13.12 14.29a14.76 14.76 0 0 1-7.5-2 9.3 9.3 0 0 0 7-2 5.82 5.82 0 0 1-5-3.5c1 .32 1.95.48 2.5 0A5.41 5.41 0 0 1 1 9a3.51 3.51 0 0 0 2.5 1A5 5 0 0 1 2 3.5Z"
                  data-name="<Path>"
                ></path>
              </g>
            </svg>
            Share
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
