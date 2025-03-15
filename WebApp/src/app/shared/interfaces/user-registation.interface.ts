import { Gender } from "../enums/gender.enum";
import { Role } from "../enums/role.enum";

export interface UserRegistration {
    firstName : string;
    lastName : string;
    email: string;
    nIF: string;
    password: string;
    gender: Gender;
    role : Role;
    birdDate: Date;
    height : number;
    weight : number;
}
