import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MaterialCostView } from "./activityCostView/MaterialCostView";
import { Chart } from "primereact/chart";
import { useAppSelector } from "../../store/store";
import { Button } from "primereact/button";
import { EquipmentCostView } from "./activityCostView/EquipmentCostView";
import { BudgetReport } from "../task/activity/budget/BudgetReport";

export const TaskActivityReport = () => {
  const params = useParams();

  const [title, setTitle] = useState("");
  const [queryParams, setQueryParams] = useSearchParams();

  const [taskChartData, setTaskChartData] = useState({});

  const [isParent, setIsParent] = useState(false);

  const [equipmentCostTotal, setequipmentCostTotal] = useState();
  const [materialCostTotal, setmaterialCostTotal] = useState();
  const [laborCostTotal, setlabortCostTotal] = useState();

  const taskActivities = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );

  const [lightOptions] = useState({
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  });

  useEffect(() => {
    setTitle(queryParams.get("name") || "");
  }, [queryParams]);

  useEffect(() => {
    const selectedTask = taskActivities.find(
      (task) => task.modelId == +params.modelId
    );

    console.log(selectedTask);
    const isParentTask = selectedTask ? !selectedTask.isActivity : false;
    setIsParent(selectedTask ? !selectedTask.isActivity : false);

    const materialCost = taskActivities
      .filter(
        (taskModel) =>
          taskModel.modelId == +params.modelId ||
          (isParentTask ? taskModel.parentId == +params.modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.materialCosts)
      .filter((materialCost) => {
        return Number.isFinite(+materialCost.price);
      })
      .map((materialCost) => materialCost.price * materialCost.qty)
      .reduce((m1, m2) => m1 + m2, 0);

    const laborCost = taskActivities
      .filter(
        (taskModel) =>
          taskModel.modelId == +params.modelId ||
          (isParentTask ? taskModel.parentId == +params.modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.laborCosts)
      .map((materialCost) => materialCost.price * materialCost.qty)
      .reduce((m1, m2) => m1 + m2, 0);

    const equipmentCost = taskActivities
      .filter(
        (taskModel) =>
          taskModel.modelId == +params.modelId ||
          (isParentTask ? taskModel.parentId == +params.modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.equipmentCosts)
      .map((materialCost) => +materialCost.dailyCost)
      .reduce((m1, m2) => m1 + m2, 0);

    const equipment = taskActivities
      .filter((taskModel) => taskModel.modelId == +params.modelId)
      .flatMap((taskActivity) => taskActivity.equipmentCosts)
      .filter((materialCost) => Number.isFinite(materialCost.price))
      .map((materialCost) => materialCost.dailyCost);

    console.log(`materialCost => ${materialCost}`);

    setequipmentCostTotal(equipmentCost ? equipmentCost : 0);
    setmaterialCostTotal(materialCost ? materialCost : 0);
    setlabortCostTotal(laborCost ? laborCost : 0);

    setTaskChartData({
      labels: ["Equipment Cost", "Material Cost", "Labor Cost"],
      datasets: [
        {
          data: [equipmentCost, materialCost, laborCost],
          backgroundColor: ["#AF4384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#AF4384", "#36A2EB", "#FFCE56"],
        },
      ],
    });
  }, [taskActivities]);

  return (
    <>
      <div className="w-screen w-screen">
        <div className="m-4 p-4">
          <p className="text-2xl text-800 font-bold my-4">Report For {title}</p>
          {/* <Divider /> */}
          <div className="grid">
            <div className="col-7">
              <Divider />
              <MaterialCostView
                isMaterial={true}
                title={"Material Cost Breakdown"}
                modalTitle={"Add Material Cost"}
                modelId={params.modelId}
              />
              <Divider />
              <EquipmentCostView modelId={params.modelId} />
              <Divider />
              <MaterialCostView
                isMaterial={false}
                title={"Labor Cost Breakdown"}
                modalTitle={"Add Labor Cost"}
                modelId={params.modelId}
              />
            </div>

            <div className="col-5 flex flex-column align-items-center justify-content-center">
              {taskChartData && (
                <>
                  <Chart
                    type="doughnut"
                    data={taskChartData}
                    options={lightOptions}
                    className="align-self-center "
                    style={{ width: "40%" }}
                  />

                  <BudgetReport
                    modelId={params.modelId}
                    isParent={isParent}
                    LaborCost={laborCostTotal}
                    equipmentCost={equipmentCostTotal}
                    materialCost={materialCostTotal}
                  />

                  <Button
                    icon="pi pi-print"
                    label="Export Task Report"
                    className="p-button-outlined p-button-secondary mt-8"
                    onClick={() => window.print()}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
