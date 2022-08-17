import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  EquipmentCost,
  LaborCost,
  MaterialCost,
  TaskActivityModel
} from "../../model/TaskActivityModel";
import { costCodes } from "./init/costCodes";

const loadInitCostCodes = (): CostCode[] => {
  return costCodes.map((c) => {
    return {
      costCode: c.costCode,
      description: c.Description,
    };
  });
};

export interface TaskActivityState {
  taskActivities: TaskActivityModel[];
  keys: CostCode[];
}

export interface CostCode {
  costCode: string;
  description: string;
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
  taskActivities: JSON.parse(localStorage.getItem("task-data")) || [],
  keys: JSON.parse(localStorage.getItem("cost-codes")) || loadInitCostCodes(),
};

export const taskActivitySlice = createSlice({
  name: "taskActivitySlice",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskActivityModel>) => {
      state.taskActivities = [...state.taskActivities, action.payload];
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.taskActivities = state.taskActivities.filter(
        (task) => action.payload !== task.modelId
      );
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
    removeMaterialCost: (state, action: PayloadAction<ActivityPayLoad>) => {
      const taskIndex = findTaskIndex(
        state.taskActivities,
        action.payload.modelId
      );

      if (taskIndex >= 0) {
        const materialModel = action.payload.materialCost;
        const materialCosts = state.taskActivities[
          taskIndex
        ].materialCosts.filter((materialCost) => {
          return !(
            materialCost.name == materialModel.name &&
            materialCost.price == materialModel.price &&
            materialCost.qty == materialModel.qty
          );
        });

        state.taskActivities[taskIndex].materialCosts = materialCosts;
      }
    },
    addKey: (state, action: PayloadAction<CostCode>) => {
      if (!state.keys.find((key) => key.costCode === action.payload.costCode)) {
        state.keys = [...state.keys, action.payload];
      }
    },
    removeKey: (state, action: PayloadAction<CostCode>) => {
      state.keys = state.keys.filter(
        (key) => key.costCode !== action.payload.costCode
      );
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
    removeLaborCost: (state, action: PayloadAction<LaborCostPayLoad>) => {
      const taskIndex = findTaskIndex(
        state.taskActivities,
        action.payload.modelId
      );

      if (taskIndex >= 0) {
        const laborModel = action.payload.laborCost;
        const laberCosts = state.taskActivities[taskIndex].laborCosts.filter(
          (laborCost) => {
            return !(
              laborCost.name == laborModel.name &&
              laborCost.price == laborModel.price &&
              laborCost.qty == laborModel.qty
            );
          }
        );

        state.taskActivities[taskIndex].laborCosts = laberCosts;
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
    removeEquipmentCost: (
      state,
      action: PayloadAction<EquipmentCostPayLoad>
    ) => {
      const taskIndex = findTaskIndex(
        state.taskActivities,
        action.payload.modelId
      );

      if (taskIndex >= 0) {
        const equipmentModel = action.payload.equipmentCost;
        const equipmentCosts = state.taskActivities[taskIndex].equipmentCosts;

        state.taskActivities[taskIndex].equipmentCosts = equipmentCosts.filter(
          (equipmentCost) => {
            const equipmentCostMatcher =
              equipmentCost.TypeofEquipment == equipmentModel.TypeofEquipment &&
              equipmentCost.dailyCost == equipmentModel.dailyCost &&
              equipmentCost.no == equipmentModel.no;
            return !equipmentCostMatcher;
          }
        );
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
  addEquipmentCost,
  addKey,
  removeKey,
  removeEquipmentCost,
  removeLaborCost,
  removeMaterialCost,
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
