import { City } from './GeoModel';
import { Participant } from './UserModel';
import { Picture } from './PictureModel';
import { Category } from './CategoryModel';
import { Comment } from './CommentModel';

export enum FavorStatus {
  CLOSE = 0,
  OPEN = 1,
  WAITING = 2,
}

export const getParticipantStatus = (status: number): { wording: string; className: string } => {
  const initialState = {
    wording: '',
    className: '',
  };
  let obj = initialState;
  switch (status) {
    case 0:
      obj.wording = 'Refusé';
      obj.className = 'text-danger';
      break;
    case 1:
      obj.wording = 'Accepté';
      obj.className = 'text-success';
      break;
    case 2:
      obj.wording = 'En attente';
      obj.className = 'text-info';
      break;
    default:
      obj = initialState;
  }
  return obj;
};

export interface Favor {
  id: number;
  title: string;
  content: string;
  status: FavorStatus;
  dateStart: string;
  dateEnd: string;
  placeLimit: number;
  category: Category;
  cities: City[];
  pictures: Picture[];
  comments: Comment[];
  users: Participant[];
}
