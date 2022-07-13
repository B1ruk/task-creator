import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskActivityModel } from "../../model/TaskActivityModel";
import { useAppSelector } from "../../store/store";

export const TaskList = () => {
  const params = useParams();
  const [selectedTask, setSelectedTask] = useState<TaskActivityModel>();

  const tasks = useAppSelector((app) => app.taskActivity.taskActivities);
  const [subTasks, setSubTasks] = useState([]);

  useEffect(() => {
    const task = tasks.find((task) => task.modelId === +params.modelId);
    task && setSelectedTask(task);

    const subTaskList = tasks.filter(
      (task) => task.parentId === +params.modelId
    );

    subTaskList && setSubTasks(subTaskList);
  }, [params]);

  return (
    <div className="w-full m-4">
      {selectedTask && (
        <>
          <p className="flex flex-row justify-content-around text-base text-800">
            <span>Task : {selectedTask.name}</span>
            <span>CostCode : {selectedTask.key}</span>
          </p>
        </>
      )}

      <Divider />
      <DataTable size="small" scrollable value={subTasks}>
        <Column header="Name" field="name" />
        <Column header="Cost Code" field="key" />
      </DataTable>
    </div>
  );
};
