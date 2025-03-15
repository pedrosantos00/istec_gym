import { DateTime } from 'luxon';
import { Gender } from '../enums/gender.enum';
import { Role } from '../enums/role.enum';

export interface ApplicationUser {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  nif: string;
  gender: Gender;
  birthDate: DateTime;
  height: number;
  weight: number;
  role: Role;
  isDelete: boolean;
}
