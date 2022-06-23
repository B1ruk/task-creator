import React from "react";
import { Button } from "primereact/button";

export const DefaultBtn = ({ callBack, name, style }) => {
  return (
    <Button
      label={name}
      className="p-button-outlined p-button-secondary mt-2"
      onClick={() => callBack()}
    ></Button>
  );
};
