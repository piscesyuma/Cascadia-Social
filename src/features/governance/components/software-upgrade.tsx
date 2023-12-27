import numeral from "numeral";
import React from "react";

import styles from "./styles/table.module.scss";

const SoftwareUpgrade: React.FC<{
  className?: string;
  height: string;
  info: string;
  name: string;
}> = ({ height, info, name }) => {
  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <table className={styles.table}>
        <tbody>
          <tr className={styles.tr}>
            <td className={styles.td}>Name</td>
            <td className={styles.td} style={{ wordBreak: "break-all" }}>
              {name}
            </td>
          </tr>
          <tr className={styles.tr}>
            <td className={styles.td}>Height</td>
            <td className={styles.td} style={{ wordBreak: "break-all" }}>
              {numeral(height).format("0,0")}
            </td>
          </tr>
          <tr className={styles.tr}>
            <td className={styles.td}>Info</td>
            <td className={styles.td} style={{ wordBreak: "break-all" }}>
              {info}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SoftwareUpgrade;
