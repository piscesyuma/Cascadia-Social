import styles from "./styles/button-loading-spinner.module.scss";

export const ButtonLoadingSpinner = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loading}></span>
    </div>
  );
};
