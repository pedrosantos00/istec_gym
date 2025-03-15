import { Difficulty } from "../enums/difficulty.enum";
import { GymclassStatus } from "../enums/gym-class-status.enum";

export interface AvailableGymClass {
    id : string;
    name: string;
    day: Date;
    duration: number;
    difficulty: Difficulty;
    maxParticipants: number;
    totalParticipants : number;
    status: GymclassStatus;
}
