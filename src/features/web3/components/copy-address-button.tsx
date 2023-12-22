import React from "react";

import { CheckIcon } from "../assets/check-icon";
import { CopyIcon } from "../assets/copy-icon";
import useCopyClipboard from "../hooks/use-copy-clipboard";

import styles from "./styles/copy-address.module.scss";

export default function CopyButton({ toCopy }: { toCopy: string }) {
  const [isCopied, setCopied] = useCopyClipboard();

  return (
    <button className={styles.container} onClick={() => setCopied(toCopy)}>
      {isCopied ? (
        <>
          <CheckIcon />
          <span>Copied Address</span>
        </>
      ) : (
        <>
          <CopyIcon />
          <span>Copy Address</span>
        </>
      )}
    </button>
  );
}
