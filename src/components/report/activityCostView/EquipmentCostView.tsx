import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { EquipmentCost } from "../../../model/TaskActivityModel";
import { useAppSelector } from "../../../store/store";
import { DefaultBtn } from "../../form/DefaultBtn";
import { AddEquipmentCostDialog } from "./AddEquipmentCost";

export const EquipmentCostView = ({ modelId }) => {
  const [modalToggle, setModalToggle] = useState(false);

  const [isParent, setIsParent] = useState(false);

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
  const [equipmentCosts, setEquipmentCosts] = useState<EquipmentCost[]>([]);

  const toggleModal = () => {
    setModalToggle(!modalToggle);
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
      </DataTable>
    </div>
  );
};
