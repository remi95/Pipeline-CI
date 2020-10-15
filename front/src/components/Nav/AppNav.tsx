import React from 'react';
import { Nav, NavItem } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import './Nav.scss';
import menuItems from '../../config/menu';
import { MenuItem } from '../../models/MenuModel';

const AppNav: React.FC = () => {
  const location = useLocation();

  return (
    <Nav className="concerto-nav">
      {
        menuItems.map((item: MenuItem) => (
          <NavItem key={item.link}>
            <Link className={`nav-link ${location.pathname.includes(item.link) ? 'is-active' : ''}`} to={item.link}>
              {item.label}
            </Link>
          </NavItem>
        ))
      }
    </Nav>
  );
};

export default AppNav;
