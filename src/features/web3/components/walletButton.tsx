import styles from "./styles/wallet-button.module.scss";

export const WalletButton = ({
  onClick,
  icon,
  text,
  disabled,
}: {
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
  disabled?: boolean;
}) => {
  return (
    <button onClick={onClick} className={styles.container} disabled={disabled}>
      {icon && icon}
      {text}
    </button>
  );
};
