import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addKey, removeKey } from "../../store/features/taskActivitySlice";
import { FormInput } from "../form/FormInput";

export const AddKeyDialog = ({ onHide, visible }) => {
  const [key, setKey] = useState();
  const dispatch = useAppDispatch();
  return (
    <Dialog
      header="Add Key"
      visible={visible}
      onHide={onHide}
      style={{ width: "40vw" }}
    >
      <FormInput
        defaultValue={key}
        onUpdate={(data) => setKey(data)}
        labelName="Key"
      />
      <Button
        type="button"
        icon="pi pi-key"
        label="Add Key"
        className="p-button-success p-button-outlined my-2 p-button-sm"
        onClick={(event) => {
          dispatch(addKey(key));
          onHide();
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
    </Dialog>
  );
};

export const KeyDialog = ({ onHide, visible }) => {
  const keys = useAppSelector((state) => state.taskActivity.keys);
  const dispatch = useAppDispatch();

  const [toggleAddKey, setToggleAddKey] = useState(false);

  useEffect(() => {
    localStorage.setItem('task-keys',JSON.stringify(keys));
  }, [keys]);

  const removeKeyAction = (keyModel) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-outlined border-0"
        onClick={(event) => {
          dispatch(removeKey(keyModel));
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
    );
  };

  return (
    <Dialog
      header="Manage Keys"
      visible={visible}
      onHide={onHide}
      style={{ width: "40vw" }}
    >
      {toggleAddKey && (
        <AddKeyDialog
          visible={toggleAddKey}
          onHide={() => setToggleAddKey(!toggleAddKey)}
        />
      )}
      <Button
        type="button"
        icon="pi pi-key"
        label="Add Key"
        className="p-button-success p-button-outlined my-2 p-button-sm"
        onClick={(event) => {
          setToggleAddKey(!toggleAddKey);
        }}
        aria-controls="popup_menu"
        aria-haspopup
      />
      <DataTable value={keys} stripedRows>
        <Column header="Key" field={(key) => key} />
        <Column header="Action" body={removeKeyAction} />
      </DataTable>
    </Dialog>
  );
};
