import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addEquipmentCost } from "../../../store/features/taskActivitySlice";
import { DefaultBtn } from "../../form/DefaultBtn";
import { FormInput } from "../../form/FormInput";

export const AddEquipmentCostDialog = ({ onHide, visible, modelId }) => {
  const dispatch = useDispatch();

  const [typeofEquipment, setTypeofEquipment] = useState("");
  const [no, setNo] = useState(0);
  const [dailyCost, setDailyCost] = useState(0);

  const addEquipmentCostCallBack = () => {
    dispatch(
      addEquipmentCost({
        modelId: modelId,
        equipmentCost: {
          TypeofEquipment: typeofEquipment,
          dailyCost: dailyCost,
          no: no,
        },
      })
    );
  };
  return (
    <Dialog
      header="Add Equipment Cost"
      onHide={onHide}
      visible={visible}
      style={{ width: "50vw" }}
    >
      <FormInput
        labelName={"Type Of Equipment"}
        onUpdate={(data) => setTypeofEquipment(data)}
      />
      <FormInput labelName={"No #"} onUpdate={(data) => setNo(data)} />
      <FormInput
        labelName={"Daily Cost"}
        onUpdate={(data) => setDailyCost(data)}
      />

      <DefaultBtn name="Add Cost" callBack={addEquipmentCostCallBack} />
    </Dialog>
  );
};
