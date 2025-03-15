import { Difficulty } from "../enums/difficulty.enum";
import { GymclassStatus } from "../enums/gym-class-status.enum";

export interface UpdateGymClassDTO {
  id : string;
  name: string;
  day: Date;
  duration: number;
  difficulty: Difficulty;
  maxParticipants: number;
  status : GymclassStatus
}
