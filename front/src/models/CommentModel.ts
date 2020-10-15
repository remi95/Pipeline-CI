import { User } from './UserModel';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}
