import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { ControlledInput } from "../form/ControlledInput";
import { useAppDispatch } from "../../store/store";
import { addTask } from "../../store/features/taskActivitySlice";

export const AddTaskDialog = ({
  onHide,
  visible,
  isActivity,
  taskParentId,
}) => {
  const [projectId, setProjectId] = useState(0);
  const [key, setKey] = useState(0);
  const [name, setName] = useState("");

  const dispatch = useAppDispatch();

  const addTaskOnClick = () => {
    dispatch(
      addTask({
        isActivity: isActivity,
        modelId: key,
        name: name,
        parentId: taskParentId ? taskParentId : 0,
        projectId: projectId,
        key: key,
        equipmentCosts: [],
        laborCosts: [],
        materialCosts: [],
      })
    );
  };

  return (
    <Dialog
      header="Add Task/Activity"
      visible={visible}
      style={{ width: "70vw" }}
      onHide={() => onHide()}
    >
      <div className="formgroup-inline flex flex-row">
        <div className="field ml-4">
          <label className="">Name</label>

          <ControlledInput onUpdate={(val) => setName(val)} type={"text"} defaultValue={""}/>
        </div>

        <div className="field ml-4">
          <label className="">Key</label>

          <ControlledInput onUpdate={(val) => setKey(val)} type={"text"} defaultValue={""}/>
        </div>

        <div className="field ml-4">
          <label className="">ProjectId</label>

          <ControlledInput onUpdate={(val) => setProjectId(val)} type={"text"} defaultValue={""}/>
        </div>

        <Button
          label="Add Task"
          icon="pi pi-user"
          className="p-button-success mb-2"
          onClick={() => addTaskOnClick()}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </div>
    </Dialog>
  );
};
