import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { EquipmentCost } from "../../../model/TaskActivityModel";
import { removeEquipmentCost } from "../../../store/features/taskActivitySlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { AddEquipmentCostDialog } from "./AddEquipmentCost";

export const EquipmentCostView = ({ modelId, cost }) => {
  const [modalToggle, setModalToggle] = useState(false);

  const [isParent, setIsParent] = useState(false);

  const dispatch = useAppDispatch();

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
  const [equipmentCosts, setEquipmentCosts] = useState<EquipmentCost[]>([]);

  const toggleModal = () => {
    setModalToggle(!modalToggle);
  };

  const removeAction = (data) => {
    return (
      <Button
        icon="pi pi-trash"
        className="p-button-outlined p-button-sm p-button-danger"
        onClick={() => {
          dispatch(removeEquipmentCost({ equipmentCost: data, modelId }));
        }}
      />
    );
  };

  useEffect(() => {
    const selectedTask = taskActivities.find(
      (task) => task.modelId == +modelId
    );

    setIsParent(selectedTask ? !selectedTask.isActivity : false);
    const isParentTask = selectedTask ? !selectedTask.isActivity : false;
    const equipments = taskActivities
      .filter(
        (taskActivity) =>
          taskActivity.modelId == modelId ||
          (isParentTask ? taskActivity.parentId == +modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.equipmentCosts);

    setEquipmentCosts(equipments);
  }, [taskActivities]);

  return (
    <div>
      <p className="font-bold text-lg">Equipment Cost</p>
      {!isParent && (
        <DefaultBtn
          callBack={toggleModal}
          name={"Add Equipment Cost"}
          style={""}
        />
      )}

      {modalToggle && (
        <AddEquipmentCostDialog
          onHide={toggleModal}
          visible={modalToggle}
          modelId={modelId}
        />
      )}

      <DataTable value={equipmentCosts}>
        <Column field="TypeofEquipment" header="Type Of Equipment" />
        <Column field="no" header="No" />
        <Column field="dailyCost" header="Daily Cost" />
        <Column header="Action" body={removeAction} />
      </DataTable>
      <p className="mt-4 font-semibold text-base">Total Amount : {cost}</p>
    </div>
  );
};
