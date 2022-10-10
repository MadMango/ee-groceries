export interface Item {
  id: string;
  name: string;
  ticked?: boolean;
  order?: number;
}

export type Groceries = Item[];
