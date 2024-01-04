"use client";
import styles from "./styles/button-loading-spinner.module.scss";

export const ButtonLoadingSpinner = ({
  width = "1.525",
  height = "1.525",
}: {
  width?: string;
  height?: string;
}) => {
  return (
    <div className={styles.container}>
      <span
        className={styles.loading}
        style={{ width: `${width}em`, height: `${height}em` }}
      ></span>
    </div>
  );
};
