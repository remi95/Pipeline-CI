import { Favor } from './FavorModel';
import { Request } from './RequestModel';
import { Picture } from './PictureModel';

export interface User {
  id: number;
  email: string;
  password: string;
  lastname: string;
  firstname: string;
  birthdate: string;
  phone: string;
  picture?: Picture;
  badges: Badge[];
  requests: Request[];
  favors: Favor[];
  apiToken?: string;
}

export enum ParticipantStatus {
  REFUSED = 0,
  ACCEPTED = 1,
  WAITING = 2,
}

export interface Participant {
  id: number;
  user: User;
  isOwner: boolean;
  status: ParticipantStatus;
}

export interface Badge {
  id: number;
  name: string;
}
