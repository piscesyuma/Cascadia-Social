"use client";
import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import styles from "./styles/redeem-button.module.scss";

export const RedeemButton = ({
  onClick,
  text = "Convert",
  disabled,
  isLoading,
}: {
  onClick?: () => void;
  text?: string;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.container}
      disabled={disabled || isLoading}
    >
      <>
        <div className={styles.title}>{text}</div>
        {isLoading && (
          <div className={styles.loading}>
            <ButtonLoadingSpinner />
          </div>
        )}
      </>
    </button>
  );
};
