import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { addSubContract } from "../../../store/features/taskActivitySlice";
import { useAppDispatch } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { FormInput } from "../../form/FormInput";

export const AddSubContractDialog = ({ onHide, visible, modelId }) => {
  const dispatch = useAppDispatch();

  const [price, setPrice] = useState();
  const [name, setName] = useState();

  const addSubContractCallBack = () => {
    dispatch(
      addSubContract({
        modelId: modelId,
        subContract: {
          name: name,
          price: price,
        },
      })
    );
  };
  return (
    <Dialog
      header="Add Sub-Contract Cost"
      onHide={onHide}
      visible={visible}
      style={{ width: "50vw" }}
    >
      <FormInput labelName={"Name"} onUpdate={(data) => setName(data)} />
      <FormInput labelName={"Price"} onUpdate={(data) => setPrice(data)} />

      <DefaultBtn name={"Add Sub-Contract"} callBack={addSubContractCallBack} />
    </Dialog>
  );
};
