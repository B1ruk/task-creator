import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MaterialCostView } from "./activityCostView/MaterialCostView";
import { Chart } from "primereact/chart";
import { useAppSelector } from "../../store/store";
import { Button } from "primereact/button";
import { EquipmentCostView } from "./activityCostView/EquipmentCostView";
import { BudgetReport } from "../task/activity/budget/BudgetReport";
import { TaskActivityModel } from "../../model/TaskActivityModel";
import { SubContractView } from "./activityCostView/SubContractView";

export const TaskActivityReport = () => {
  const params = useParams();

  const [title, setTitle] = useState("");
  const [queryParams, setQueryParams] = useSearchParams();

  const [taskChartData, setTaskChartData] = useState({});

  const [isParent, setIsParent] = useState(false);

  const [selectedTask, setSelectedTask] = useState<TaskActivityModel>();

  const [equipmentCostTotal, setequipmentCostTotal] = useState<number>(0);
  const [materialCostTotal, setmaterialCostTotal] = useState<number>(0);
  const [laborCostTotal, setlabortCostTotal] = useState<number>(0);
  const [subContractTotal, setSubContractTotal] = useState<number>(0);

  const taskActivities: TaskActivityModel[] = useAppSelector(
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

    setSelectedTask(selectedTask);

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

    const subContractCost = taskActivities
      .filter(
        (taskModel) =>
          taskModel.modelId == +params.modelId ||
          (isParentTask ? taskModel.parentId == +params.modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.subContracts)
      .filter(subContract=>subContract.price)
      .map((subContract) => +subContract.price)
      .reduce((s1, s2) => s1 + s2, 0);

    const laborCost = taskActivities
      .filter(
        (taskModel) =>
          taskModel.modelId == +params.modelId ||
          (isParentTask ? taskModel.parentId == +params.modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.laborCosts)
      .map((materialCost) => +materialCost.price * +materialCost.qty)
      .reduce((m1, m2) => m1 + m2, 0);

    const equipmentCost = taskActivities
      .filter(
        (taskModel) =>
          taskModel.modelId == +params.modelId ||
          (isParentTask ? taskModel.parentId == +params.modelId : false)
      )
      .flatMap((taskActivity) => taskActivity.equipmentCosts)
      .filter((equipmentCost) => Number.isFinite(+equipmentCost.dailyCost))
      .map((equipmentCost) => +equipmentCost.dailyCost)
      .reduce((m1, m2) => m1 + m2, 0);

    setequipmentCostTotal(equipmentCost ? equipmentCost : 0);
    setmaterialCostTotal(materialCost ? materialCost : 0);
    setlabortCostTotal(laborCost ? laborCost : 0);
    setSubContractTotal(subContractCost ? subContractCost : 0);

    setTaskChartData({
      labels: ["Equipment Cost", "Material Cost", "Labor Cost","Sub-Contract Cost"],
      datasets: [
        {
          data: [equipmentCost, materialCost, laborCost,subContractCost],
          backgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","#EFEFEF"],
          hoverBackgroundColor: ["#AF4384", "#36A2EB", "#FFCE56","E6E6E6"],
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
              <EquipmentCostView
                modelId={params.modelId}
                cost={equipmentCostTotal}
              />
              <Divider />
              <MaterialCostView
                isMaterial={false}
                title={"Labor Cost Breakdown"}
                modalTitle={"Add Labor Cost"}
                modelId={params.modelId}
              />

              <SubContractView
                modelId={params.modelId}
                cost={subContractTotal}
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

                  {selectedTask && (
                    <BudgetReport
                      modelId={params.modelId}
                      isParent={!selectedTask.isActivity}
                      LaborCost={laborCostTotal}
                      equipmentCost={equipmentCostTotal}
                      materialCost={materialCostTotal}
                      subContract={subContractTotal}
                    />
                  )}

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
