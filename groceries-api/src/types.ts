export interface Item {
  id: string;
  name: string;
  quantity: number;
  ticked?: boolean;
  order?: number;
}

export type Groceries = Item[];
