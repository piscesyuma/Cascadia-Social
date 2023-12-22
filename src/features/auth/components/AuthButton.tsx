import { ButtonLoadingSpinner } from "@/components/elements/button-loading-spinner";

import styles from "./styles/auth-button.module.scss";

export const AuthButton = ({
  onClick,
  icon,
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
    <button onClick={onClick} className={styles.container}>
      <div className={styles.title}>
        {icon && icon}
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
