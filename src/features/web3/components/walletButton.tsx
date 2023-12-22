import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import { MetamaskLogo } from "../assets/metamask-logo";

import styles from "./styles/wallet-button.module.scss";

export const WalletButton = ({
  onClick,
  icon = <MetamaskLogo />,
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
      <div className={styles.title}>
        {icon}
        {text}
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <ButtonLoadingSpinner />
        </div>
      )}
    </button>
  );
};
