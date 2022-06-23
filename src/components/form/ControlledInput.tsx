import React, { useState } from "react";

export function ControlledInput({ onUpdate, type,defaultValue }) {
  const [value, setState] = useState(defaultValue);
  const handleChange = (e) => {
    setState(e.target.value);
    onUpdate(e.target.value);
  };

  const inputType = !type ? "text" : type;

  return (
    <input
      id="search"
      type={inputType}
      value={value}
      onChange={handleChange}
      className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary"
    />
  );
}
