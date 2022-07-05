import React from "react";
import { ControlledInput } from "./ControlledInput";

export const FormInput = ({ onUpdate, defaultValue, labelName }) => {
  return (
    <div className="flex flex-column">
      <label className="py-2 text-base font-bold">{labelName}</label>

      <ControlledInput onUpdate={onUpdate} defaultValue={defaultValue} type={"text"}/>
    </div>
  );
};


