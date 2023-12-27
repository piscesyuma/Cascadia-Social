import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import styles from "./styles/vote-button.module.scss";

export const VoteButton = ({
  onClick,
  text,
  disabled,
  isLoading,
}: {
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={styles.container}
      disabled={disabled || isLoading}
    >
      <div className={styles.title}>{text}</div>
      {isLoading && (
        <div className={styles.loading}>
          <ButtonLoadingSpinner />
        </div>
      )}
    </button>
  );
};
