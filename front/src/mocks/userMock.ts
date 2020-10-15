import { User } from '../models/UserModel';

const userMock: User = {
  id: 1,
  email: 'simon.toulouze@gmail.com',
  password: 'JjjjHhdazbaNHDZNUdnzua99!',
  lastname: 'Toulouze',
  firstname: 'Simon',
  birthdate: '1993-08-20T17:00:00+01:00',
  phone: '+33611846901',
  picture: {
    id: 2,
    name: '77hhhHGgeg277e6dgJkNggdqvVVd9.jpg',
    originalName: 'jesuisunephoto.jpg',
    path: 'https://images.pexels.com/photos/207962',
  },
  badges: [],
  requests: [],
  favors: [],
};

export default userMock;
