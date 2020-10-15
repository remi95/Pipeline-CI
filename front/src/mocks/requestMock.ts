import userMock from './userMock';
import cityMock from './cityMock';

const requestMock = {
  id: 1,
  title: "Je veux que quelqu'un me coupe les cheveux",
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  dateStart: '2020-04-29T14:56:38+01:00',
  dateEnd: '2020-05-12T14:56:38+01:00',
  category: {
    id: 2,
    name: 'Ménage',
  },
  user: userMock,
  city: cityMock,
  comments: [],
};

export default requestMock;
