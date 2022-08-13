import React, { useEffect, useRef, useState } from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useAppSelector } from "../../../store/store";
import { AddMaterialCost } from "../../task/activity/AddMaterialCost";
import {
  EquipmentCost,
  LaborCost,
  MaterialCost,
} from "../../../model/TaskActivityModel";

export const MaterialCostView = ({
  isMaterial,
  title,
  modalTitle,
  modelId,
}) => {
  const [modalToggle, setModalToggle] = useState(false);

  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const [laborCosts, setLaborCosts] = useState<LaborCost[]>([]);
  const [laborCostTotal, setLaborCostTotal] = useState<number>(0);

  const toast = useRef();

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );

  useEffect(() => {
    let materialList: MaterialCost[] = [];
    let laborCostList: LaborCost[] = [];

    if (isMaterial) {
      materialList = taskActivities
        .filter((task) => task.modelId == modelId)
        .flatMap((taskActivity) => taskActivity.materialCosts);
    } else {
      laborCostList = taskActivities
        .filter((task) => task.modelId == modelId)
        .flatMap((taskActivity) => taskActivity.laborCosts);
    }

    const total = (isMaterial ? materialList : laborCostList)
      .map((costModel) => costModel.price * costModel.qty)
      .reduce((m1, m2) => m1 + m2, 0);

    if (total > 0 && toast && toast.current) {
      toast.current.show({ severity: "success", summary: "success" });
    }

    if (isMaterial) {
      setMaterialCosts(materialList);
      setTotalCost(total);
    } else {
      setLaborCostTotal(total);
      setLaborCosts(laborCostList);
    }
  }, [taskActivities]);

  const toggleModal = () => {
    setModalToggle(!modalToggle);
  };

  const AddMaterialCostOnClick = () => {
    toggleModal();
  };

  return (
    <div>
      <p className="font-bold text-lg">{title}</p>

      <Toast ref={toast} />

      {modalToggle && (
        <AddMaterialCost
          title={modalTitle}
          isMaterial={isMaterial}
          onHide={toggleModal}
          visible={modalToggle}
          modelId={modelId}
        />
      )}

      <Button
        label={modalTitle}
        className="p-button-success my-2"
        onClick={() => AddMaterialCostOnClick()}
        aria-controls="popup_menu"
        aria-haspopup
      />

      <DataTable value={isMaterial ? materialCosts : laborCosts}>
        <Column header="Name" field="name" />
        <Column header="Price" field="price" />
        <Column header="Unit" field="unit" />
        <Column header="Qty" field="qty" />
      </DataTable>

      {(isMaterial ? totalCost : laborCostTotal) > 0 && (
        <p className="mt-4 font-bold text-base">
          Total Amount {isMaterial ? totalCost : laborCostTotal} Birr
        </p>
      )}
    </div>
  );
};
