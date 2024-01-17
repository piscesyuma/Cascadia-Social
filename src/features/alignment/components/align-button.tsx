"use client";
import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import styles from "./styles/align-button.module.scss";

export const AlignButton = ({
  onClick,
  text = "Approve",
  icon,
  direction = "row",
  disabled,
  isLoading,
}: {
  onClick?: () => void;
  text?: string;
  icon?: React.ReactNode;
  direction?: string;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.container}
      disabled={disabled || isLoading}
    >
      <div className={`${direction !== "row" && styles.col} ${styles.wrapper}`}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.title}>{text}</div>
        {isLoading && (
          <div className={styles.loading}>
            <ButtonLoadingSpinner />
          </div>
        )}
      </div>
    </button>
  );
};
