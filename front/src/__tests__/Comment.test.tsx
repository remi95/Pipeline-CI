import React from 'react';
import renderer from 'react-test-renderer';
import Comment from '../components/Comments/Comment';

const commentMock = {
  id: 1,
  content: 'Test commentaire',
  createdAt: '2020-04-21T00:00:00',
  user: {
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
  },
};

describe('Comment component tests', () => {
  test('Should render a correct Comment snapshot', () => {
    const component = renderer.create(<Comment comment={commentMock} />);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
