export interface Task {
    id: number;
    description: string;
    assignedTo?: number | null;
    status?: "todo" | "in_progress" | "done";
    id_dossier?: string;
}