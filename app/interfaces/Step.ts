import { Task } from "./Task";

export interface Step {
    id: number;
    nom: string;
    description: string;
    tasks: Task[];
}