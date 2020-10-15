import React, { ReactElement, useState } from 'react';
import {
  Collapse,
  Navbar,
  Nav,
  NavItem,
  Button,
  Form,
  FormGroup,
  Input,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { useSelector, RootStateOrAny } from 'react-redux';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './Navbar.scss';
import Logo from '../../assets/images/logo.png';
import AppNav from '../Nav/AppNav';
import Loader from '../Loader';
import ROUTES from '../../config/routes';

const AppNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isLoading = useSelector((state: RootStateOrAny) => (
    state.categoryReducer.topCategoriesLoading));
  const isAuth = useSelector((state: RootStateOrAny) => state.user.user);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const renderButtons = (): ReactElement => {
    if (isAuth) {
      return (
        <div>
          <Link to={ROUTES.NEW_FAVOR} className="service-btn btn btn-primary">Proposer un service</Link>
          <Link to={ROUTES.NEW_REQUEST} className="service-btn btn btn-outline-secondary">Demander un service</Link>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
              <FaUserCircle />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <Link to={ROUTES.PROFIL}>Mes informations</Link>
              </DropdownItem>
              <DropdownItem>
                <Link to={ROUTES.HISTORY}>Historique de mes services</Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    }

    return (
      <div>
        <Link to={ROUTES.REGISTER} className="btn btn-outline-secondary mx-1">S'inscrire</Link>
        <Link to={ROUTES.LOGIN} className="btn btn-secondary mx-1">Se connecter</Link>
      </div>
    );
  };

  return (
    <header>
      <Navbar className="concerto-navbar" color="white" light expand="md">
        <Link className="navbar-brand" to="/">
          <img src={Logo} alt="concerto logo" />
          <span className="text-primary">Concerto</span>
        </Link>

        {/* <NavbarToggler onClick={toggle} /> */}

        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Form inline className="search-form">
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <FaSearch />
                  <Input type="text" name="search" id="search" placeholder="Trouver un service" />
                </FormGroup>
              </Form>
            </NavItem>
          </Nav>

          {renderButtons()}
        </Collapse>
      </Navbar>

      {
        isLoading
          ? (
            <div className="text-center pt-2 pb-2">
              <Loader size={2} />
            </div>
          )
          : (
            <AppNav />
          )
      }
    </header>
  );
};

export default AppNavbar;
