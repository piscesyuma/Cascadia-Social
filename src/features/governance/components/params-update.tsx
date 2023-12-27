import numeral from "numeral";
import React from "react";

import styles from "./styles/table.module.scss";

const ParamsUpdate: React.FC<{
  className?: string;
  params: any;
}> = ({ params }) => {
  const getValue = (key: string, value: any) => {
    if (value === true) return "True";
    if (value === false) return "False";

    const numberRegex = /^-?\d+(\.\d+)?$/;

    if (numberRegex.test(value)) {
      return numeral(value.toString()).format("0,0.00[00]");
    }

    if (Array.isArray(value) && key === "min_deposit") {
      const item: any = value[0];
      return `${numeral(item.amount.toString()).format("0,0.00[00]")} ${
        item.denom
      }`;
    }

    return value;
  };

  return (
    <div style={{ overflow: "auto" }}>
      <table className={styles.table}>
        <tbody>
          {Object.keys(params).map((key, index) => (
            <tr key={index} className={styles.tr}>
              <td className={styles.td}>{key}</td>
              <td className={styles.td}>{getValue(key, params[key])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParamsUpdate;
