import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Adapter from 'enzyme-adapter-react-16';
import Nav from '../components/Nav/AppNav';
import ROUTES from '../config/routes';

Enzyme.configure({ adapter: new Adapter() });

describe('NavBar tests', () => {
  it('Should return only one active link.', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={[ROUTES.FAVORS]}>
        <Nav />
      </MemoryRouter>,
    );

    const activeLink = wrapper.find('a.is-active');
    expect(activeLink).toHaveLength(1);
    expect(activeLink.prop('href')).toBe(ROUTES.FAVORS);
  });
});
