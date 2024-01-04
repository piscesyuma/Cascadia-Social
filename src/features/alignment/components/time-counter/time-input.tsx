import React from "react";

interface inputProps {
  value: number;
  handleClick(): void;
  handleChange(e: any): void;
}

export const TimerInput = ({
  value,
  handleClick,
  handleChange,
}: inputProps) => {
  return (
    <div className="z-6 mx-auto flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0">
      <input
        className="font-redhat mr-4 w-40 rounded-lg px-2 py-1 text-lg outline-none md:text-2xl "
        name="Timer Input"
        type="number"
        placeholder="Enter No. of Days"
        value={value}
        onChange={handleChange}
        min={0}
      />

      <button
        onClick={handleClick}
        className="font-redhat rounded-xl bg-rose-300 px-4 py-2 text-xl font-semibold text-rose-500 transition duration-300 ease-in hover:bg-rose-500 hover:text-rose-100 md:text-xl"
      >
        {" "}
        Set Value
      </button>
    </div>
  );
};
