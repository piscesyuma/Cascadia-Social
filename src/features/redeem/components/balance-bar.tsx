import React from "react";

import styles from "./styles/balance-bar.module.scss";

type Props = {
  width: string | number;
  bufferWidth: string | number;
  size?: string;
  color?: string;
  isOver?: boolean;
};

const BalanceBar = ({
  width,
  bufferWidth,
  size = "4",
  color,
  isOver,
}: Props) => {
  const barStyles = { width: `${width}%`, height: `${size}px` };
  const bufferBarStyles = { width: `${bufferWidth}%` };

  return (
    <div className={styles.container}>
      <div
        className={`${isOver && styles.isOver} ${styles.value}`}
        style={barStyles}
      />
      {Number(bufferWidth) > 0 && (
        <div className="buffer" style={bufferBarStyles} />
      )}
    </div>
  );
};

export default BalanceBar;
