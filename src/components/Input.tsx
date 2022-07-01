import React, { InputHTMLAttributes, ChangeEvent } from "react";

interface Props extends Omit<InputHTMLAttributes<any>, "onChange"> {
  className?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const Input = (props: Props) => {
  const { className, children, onChange, placeholder, ...rest } = props;

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    return null;
  };

  return (
    <label>
      <input onChange={handleOnChange} autoComplete="off" autoCorrect="off" className={className} placeholder={placeholder} />
    </label>
  );
};

export default Input;
