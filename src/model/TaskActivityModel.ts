export interface TaskActivityModel {
  key: number|string;
  projectId?: number;
  name: string;
  parentId: number;
  modelId: number;
  isActivity: boolean;
  budget:number|undefined;
  
  materialCosts: MaterialCost[];
  laborCosts: LaborCost[];
  equipmentCosts: EquipmentCost[]
  subContracts:SubContract[];
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

export interface SubContract{
  name:string;
  price:string;
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
