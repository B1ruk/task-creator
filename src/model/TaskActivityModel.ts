export interface TaskActivityModel {
  key: number|string;
  projectId?: number;
  name: string;
  parentId: number;
  modelId: number;
  isActivity: boolean;
  
  materialCosts: MaterialCost[];
  laborCosts: LaborCost[];
  equipmentCosts: EquipmentCost[]
}

export interface ActivityCost {
  materialCosts: MaterialCost[];
  laborCosts: LaborCost[];
  equipmentCosts: EquipmentCost[];
}

export interface MaterialCost {
  name: string;
  price: number;
  unit?: string;
  qty: number;
}

export interface LaborCost {
  name: string;
  price: number;
  unit?: string;
  qty: number;
}

export interface EquipmentCost {
  TypeofEquipment: string;
  no: number;
  dailyCost: number;
}
