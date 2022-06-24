import { TaskActivityModel } from "./TaskActivityModel";

export const mapTaskActivityToTree = (taskActivites: TaskActivityModel[]) => {
  const parentIds = taskActivites
    .filter((task) => task.parentId === 0)
    .map((task) => task.modelId);

  const parentNodes = new Set(parentIds);

  return [...parentNodes].map((parentId) => {
    const nodes = createNode(parentId, taskActivites);

    if (nodes && nodes.children.length > 0) {
      return {
        ...nodes,
        ...nodes.children?.map((node) =>
          createNode(node.parentId, taskActivites)
        ),
      };
    }
    return nodes;
  });
};

function createNode(parentId: number | undefined, datas: TaskActivityModel[]) {
  const task: TaskActivityModel | undefined = datas.find(
    (task) => task.modelId == parentId
  );

  if (task) {
    return {
      key: task.parentId + "-" + task.projectId,
      data: task,
      children: [
        ...datas
          .filter(
            (taskModel) =>
              task.modelId == taskModel.parentId &&
              task.modelId != taskModel.modelId
              )
          .map((subTask) => {
            return {
              key: task.parentId + "-" + task.projectId + subTask.key,
              data: subTask,
            };
          }),
      ],
    };
  }

  return {
    children: [],
  };
}


function createChildNodes(datas:TaskActivityModel[],parentTask:TaskActivityModel){
  const subTasks=datas.filter(task=>task.parentId==parentTask.modelId);

  if(subTasks.length>0){

  }
  return[];
}
