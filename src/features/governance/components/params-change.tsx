import React from "react";

import styles from "./styles/table.module.scss";

const ParamsChange: React.FC<{
  className?: string;
  changes: {
    subspace: string;
    key: string;
    value: string;
  }[];
}> = ({ changes }) => {
  return (
    <div style={{ overflow: "auto" }}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}>Subspace</th>
            <th className={styles.th}>Key</th>
            <th className={styles.th}>Value</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((row) => (
            <tr key={row.key} className={styles.tr}>
              <td className={styles.td}>{row.subspace}</td>
              <td className={styles.td}>{row.key}</td>
              <td className={styles.td}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParamsChange;
