import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import { TaskActivityModel } from "../../../../model/TaskActivityModel";
import { useAppSelector } from "../../../../store/store";

export const BudgetReport = ({
  modelId,
  isParent,
  materialCost,
  equipmentCost,
  LaborCost,
}) => {
  const tasks: TaskActivityModel[] = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
  const [parentTask, setParentTask] = useState<TaskActivityModel>();

  useEffect(() => {
    const task = tasks.find((t) => {
      if (isParent) {
        return t.modelId === +modelId;
      }
      return t.parentId === +modelId;
    });

    console.log(task);
    console.log(`modelId=>${modelId} --- isParentTask =>${isParent} budget => ${task?task.budget:0}`);

    setParentTask(task);
  }, [tasks]);

  return (
    <>
      <div className="w-4">
      {parentTask && (
        <div className="flex flex-column">
          <p className="flex flex-row justify-content-between">
            <span>Equipment Cost</span>
            <span>{equipmentCost}</span>
          </p>
          <p className="flex flex-row justify-content-between">
            <span>Material Cost</span>
            <span>{materialCost}</span>
          </p>
          <p className="flex flex-row justify-content-between">
            <span>Labor Cost</span>
            <span>{LaborCost}</span>
          </p>
          <p className="flex flex-row justify-content-between">
            <span>Total Cost</span>
            <span>{materialCost + equipmentCost + LaborCost}</span>
          </p>
            <p className="flex flex-row justify-content-between">
              <span>Budget</span>
              <span>{parentTask?.budget}</span>
            </p>
        </div>
      )}
      </div>
    </>
  );
};
