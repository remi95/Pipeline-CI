import { User } from './UserModel';
import { City } from './GeoModel';
import { Category } from './CategoryModel';
import { Comment } from './CommentModel';

export interface Request {
  id: number;
  title: string;
  content: string;
  dateStart: string;
  dateEnd: string;
  category: Category;
  user: User;
  cities: City[];
  comments: Comment[];
}
