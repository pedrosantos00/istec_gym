import { DateTime } from 'luxon';
import { Difficulty } from '../enums/difficulty.enum';
import { GymclassStatus } from '../enums/gym-class-status.enum';

export interface GymClass {
  id : string;
  name: string;
  day: Date;
  duration: number;
  difficulty: Difficulty;
  maxParticipants: number;
  status: GymclassStatus;
}
