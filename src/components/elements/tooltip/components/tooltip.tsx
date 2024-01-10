import React from "react";

import styles from "./styles/tooltip.module.scss";

export const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className={styles.container}>
      {children}
      <div className={styles.tooltip}>{text}</div>
    </div>
  );
};
