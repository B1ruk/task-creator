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
  subContract,
}) => {
  const tasks: TaskActivityModel[] = useAppSelector(
    (state) => state.taskActivity.taskActivities
  );
  const [parentTask, setParentTask] = useState<TaskActivityModel>();
  const totalCost = materialCost + equipmentCost + LaborCost+subContract;

  useEffect(() => {
    const task = tasks.find((t) => {
      if (isParent) {
        return t.modelId === +modelId;
      }
      return t.parentId === +modelId;
    });

    console.log(task);
    console.log(
      `modelId=>${modelId} --- isParentTask =>${isParent} budget => ${
        task ? task.budget : 0
      }`
    );

    setParentTask(task);
  }, [tasks]);

  return (
    <>
      <div className="w-4">
        <div className="flex flex-column">
          <p className="flex flex-row justify-content-between font-semibold">
            <span>Equipment Cost</span>
            <span>{equipmentCost}</span>
          </p>
          <p className="flex flex-row justify-content-between font-semibold">
            <span>Material Cost</span>
            <span>{materialCost}</span>
          </p>
          <p className="flex flex-row justify-content-between font-semibold">
            <span>Labor Cost</span>
            <span>{LaborCost}</span>
          </p>
          <p className="flex flex-row justify-content-between font-semibold">
            <span>Sub-Contract Cost</span>
            <span>{subContract}</span>
          </p>
          <p className="flex flex-row justify-content-between font-semibold">
            <span>Total Cost</span>
            <span>{totalCost}</span>
          </p>
          {parentTask && (
            <>
              <p className="flex flex-row justify-content-between font-semibold">
                <span>Budget</span>
                <span>{parentTask?.budget}</span>
              </p>

              {parentTask?.budget < totalCost && (
                <p className="text-pink-500 font-semibold">
                  Budget overflow by {totalCost - parentTask?.budget} Birr{" "}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
