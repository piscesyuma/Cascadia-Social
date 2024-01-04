import React from "react";

import { escapeRegExp } from "../utils";

import styles from "./styles/input.module.scss";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number;
  onUserInput: (input: string) => void;
  error?: boolean | string;
  fontSize?: string;
  align?: "right" | "left";
  className?: string;
} & Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  return (
    <input
      className={styles.input}
      {...rest}
      value={value}
      onChange={(event) => {
        enforcer(event.target.value.replace(/,/g, "."));
      }}
      inputMode="decimal"
      title="Token Amount"
      autoComplete="off"
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || "0.0"}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
});

export default Input;
