import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { addLaborCost, addMaterialCost } from "../../../store/features/taskActivitySlice";
import { useAppDispatch } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { FormInput } from "../../form/FormInput";

export const AddMaterialCost = ({
  onHide,
  visible,
  modelId,
  title,
  isMaterial,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState(0);

  const appDispatch = useAppDispatch();

  const addMaterialCostCallBack = () => {
    const cost = {
      modelId: modelId,
      materialCost: {
        name,
        price,
        unit,
        qty,
      },
    };
    if (isMaterial) {
      appDispatch(addMaterialCost(cost));
    } else {
        appDispatch(addLaborCost({
            modelId ,
            laborCost: {
              name,
              price,
              unit,
              qty,
            },
          }));
    }
  };

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "70vw" }}
      onHide={() => onHide()}
    >
      <div className="formgroup">
        <FormInput
          defaultValue={""}
          labelName={"Name"}
          onUpdate={(val) => setName(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Price"}
          onUpdate={(val) => setPrice(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Unit"}
          onUpdate={(val) => setUnit(val)}
        />
        <FormInput
          defaultValue={""}
          labelName={"Qty"}
          onUpdate={(val) => setQty(val)}
        />

        <DefaultBtn name={"Add Cost"} callBack={addMaterialCostCallBack} style={""} />
      </div>
    </Dialog>
  );
};
