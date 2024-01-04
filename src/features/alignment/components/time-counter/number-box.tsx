import React from "react";

import styles from "./styles/number-box.module.scss";

interface numProp {
  num: string | number;
  unit: string;
  flip: boolean;
}

export const NumberBox = ({ num, flip }: numProp) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.bg1}></div>

        <div className={styles.number}>{num}</div>

        <div className={styles.bg2}></div>

        <div className={`${styles.flip} ${flip && styles.isFlip}`}></div>

        <div className="absolute -right-[2px] top-[22px] h-1 w-1 rounded-full bg-primary-500 dark:bg-white"></div>
        <div className="absolute -left-[2px] top-[22px] h-1 w-1 rounded-full bg-primary-500 dark:bg-white"></div>
      </div>
    </div>
  );
};
