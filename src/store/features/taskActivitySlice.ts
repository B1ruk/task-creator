import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  EquipmentCost,
  LaborCost,
  MaterialCost,
  TaskActivityModel,
} from "../../model/TaskActivityModel";

export interface TaskActivityState {
  taskActivities: TaskActivityModel[];
}

export interface ActivityPayLoad {
  modelId: number;
  materialCost: MaterialCost;
}

export interface LaborCostPayLoad {
  modelId: number;
  laborCost: LaborCost;
}

export interface EquipmentCostPayLoad {
  modelId: number;
  equipmentCost: EquipmentCost;
}

const initialState: TaskActivityState = {
  taskActivities: JSON.parse(localStorage.getItem('task-data'))||[],
};

export const taskActivitySlice = createSlice({
  name: "taskActivitySlice",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskActivityModel>) => {
      state.taskActivities = [...state.taskActivities, action.payload];
    },
    updateTask: (state, action: PayloadAction<TaskActivityModel>) => {
      const taskIndex = findTaskIndex(
        state.taskActivities,
        action.payload.modelId
      );

      if (taskIndex >= 0) {
        state.taskActivities[taskIndex].name = action.payload.name;
      }
    },
    removeTask: (state, action: PayloadAction<TaskActivityModel>) => {},
    addMaterialCost: (state, action: PayloadAction<ActivityPayLoad>) => {
      const taskIndex = findTaskIndex(
        state.taskActivities,
        action.payload.modelId
      );

      if (taskIndex >= 0) {
        const materialModel = action.payload.materialCost;
        const materialCosts = state.taskActivities[taskIndex].materialCosts;

        state.taskActivities[taskIndex].materialCosts = [
          ...materialCosts,
          materialModel,
        ];
      }
    },
    addLaborCost: (state, action: PayloadAction<LaborCostPayLoad>) => {
      const taskIndex = findTaskIndex(
        state.taskActivities,
        action.payload.modelId
      );

      if (taskIndex >= 0) {
        const laborModel = action.payload.laborCost;
        const laberCosts = state.taskActivities[taskIndex].laborCosts;

        state.taskActivities[taskIndex].laborCosts = [
          ...laberCosts,
          laborModel,
        ];
      }
    },
    addEquipmentCost: (state, action: PayloadAction<EquipmentCostPayLoad>) => {
      const taskIndex = findTaskIndex(
        state.taskActivities,
        action.payload.modelId
      );

      if (taskIndex >= 0) {
        const equipmentModel = action.payload.equipmentCost;
        const equipmentCosts = state.taskActivities[taskIndex].equipmentCosts;

        state.taskActivities[taskIndex].equipmentCosts = [
          ...equipmentCosts,
          equipmentModel,
        ];
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  removeTask,
  addMaterialCost,
  addLaborCost,
  addEquipmentCost
} = taskActivitySlice.actions;

export default taskActivitySlice.reducer;

const findTaskIndex = (
  tasks: TaskActivityModel[],
  taskModelId: number
): number => {
  const taskIndex = tasks.findIndex(
    (taskModel) => taskModel.modelId == taskModelId
  );
  return taskIndex;
};
