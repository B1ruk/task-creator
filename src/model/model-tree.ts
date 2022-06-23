import { TaskActivityModel } from "./TaskActivityModel";

export const mapTaskActivityToTree = (taskActivites: TaskActivityModel[]) => {
  const parentIds = taskActivites.map((task) => task.modelId);

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

//we need to iterate through nodes

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
              task.modelId != taskModel.modelId &&
              !task.isActivity
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
