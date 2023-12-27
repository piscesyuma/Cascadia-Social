import React from "react";

import styles from "./styles/radio-item.module.scss";

const RadioElement = ({
  text,
  onChange,
  selected,
  name,
}: {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  selected: string;
}) => {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type="radio"
        value={text}
        name={name}
        checked={selected === text}
        id={text}
        onChange={onChange}
      />
      <label className={styles.label} htmlFor={text}>
        {text}
      </label>
    </div>
  );
};

export default RadioElement;
