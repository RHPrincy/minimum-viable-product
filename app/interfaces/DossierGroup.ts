import { Step } from "./Step";

export interface DossierGroup {
    id: string;
    nom: string;
    steps: Step[];
}