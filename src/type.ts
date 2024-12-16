export type Todo = {
  userId?: number;
  id: number;
  title: string;
  completed: boolean | string;
  description?: string;
}[];

export type TodoObject = {
  userId?: number;
  id: number;
  title: string;
  completed: boolean | string;
  description?: string;
};
