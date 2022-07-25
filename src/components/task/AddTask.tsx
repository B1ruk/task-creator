import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { ControlledInput } from "../form/ControlledInput";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { addTask } from "../../store/features/taskActivitySlice";
import { Divider } from "primereact/divider";

export const AddTaskDialog = ({
  onHide,
  visible,
  isActivity,
  taskParentId,
}) => {
  const [projectId, setProjectId] = useState(0);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");

  const dispatch = useAppDispatch();

  const keys = useAppSelector((state) =>
    state.taskActivity.keys.map((data) => data.costCode.concat(" ").concat(data.description))
  );

  const addTaskOnClick = () => {
    dispatch(
      addTask({
        isActivity: isActivity,
        modelId: Math.floor(Math.random() * 1000),
        name: !isActivity ? name : keys.find(k=>k==key),
        parentId: taskParentId ? taskParentId : 0,
        projectId: projectId,
        key: key,
        equipmentCosts: [],
        laborCosts: [],
        materialCosts: [],
      })
    );

    onHide();
  };

  return (
    <Dialog
      header="Add Task/Activity"
      visible={visible}
      style={{ width: "40vw" }}
      onHide={() => onHide()}
    >
      <div className="formgroup-inline flex flex-column">
        {!isActivity && (
          <div className="field ml-4">
            <label className="">Name</label>

            <ControlledInput
              onUpdate={(val) => setName(val)}
              type={"text"}
              defaultValue={""}
            />
          </div>
        )}

        {isActivity && (
          <div className="field ml-4">
            <label className="">Cost Code</label>

            <Dropdown
              value={key}
              options={keys}
              onChange={(e) => setKey(e.value)}
            />

            {/* <ControlledInput onUpdate={(val) => setKey(val)} type={"text"} defaultValue={""}/> */}
          </div>
        )}

        <Divider/>

        <Button
          label={`${isActivity ? "Add Sub-Activity" : "Add Activity"}`}
          icon="pi pi-user"
          className="p-button-success p-button-outlined mb-2 ml-4"
          onClick={() => addTaskOnClick()}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </div>
    </Dialog>
  );
};
