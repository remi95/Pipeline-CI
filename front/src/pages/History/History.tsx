import React, { useEffect, useState } from 'react';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux';
import { Badge, Button, Table } from 'reactstrap';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Link } from 'react-router-dom';
// import { MdDelete } from 'react-icons/md';
import Layout from '../../components/Layout/Layout';
import { getUserFavors } from '../../actions/userAction';
import './History.scss';
import UserModal from '../../components/UserModal/UserModal';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { getParticipantStatus } from '../../models/FavorModel';
import ROUTES from '../../config/routes';
import { Participant, ParticipantStatus } from '../../models/UserModel';

const History: React.FC = () => {
  const dispatch = useDispatch();
  const favors = useSelector((reducers: RootStateOrAny) => reducers.user.favors);

  const [active, setActive] = useState(1);
  // les services appartenant à l'utilisateur
  const [userFavors, setUserFavors] = useState({
    currents: [],
    pasts: [],
  });
  // les utilisateurs appartenant a un service
  const [favorUsers, setFavorUsers] = useState([]);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    dispatch(getUserFavors());
  }, []);

  useEffect(() => {
    if (favors.results && favors.results.length >= 1) {
      const now = dayjs().format();
      const currents = favors.results[0].filter((favor: any) => dayjs(favor.favor.dateEnd).format() >= now);
      const pasts = favors.results[0].filter((favor: any) => dayjs(favor.favor.dateEnd).format() <= now);
      setUserFavors({
        currents,
        pasts,
      });
    }

    setModal(false);
  }, [favors]);

  const toggleRender = (nb: number): void => setActive(nb);

  const toggleModal = (): void => setModal(!modal);

  const openModal = (users: any): void => {
    toggleModal();
    setFavorUsers(users);
  };

  const renderFavorTableBody = (favor: any, isAdmin = false) => {
    const subscribeds = favor.favor.users.filter((user: Participant) => (
      user.status === ParticipantStatus.ACCEPTED));
    const waitingUsers = favor.favor.users.filter((user: Participant) => (
      user.status === ParticipantStatus.WAITING));
    let lastTdContent;

    if (isAdmin) {
      lastTdContent = (
        <Button
          className="participant-btn mr-2"
          color="primary"
          onClick={(): void => openModal(favor.favor.users)}
        >
          Gestion des bénéficiaires
          {
            waitingUsers.length > 0
              ? <Badge color="secondary">{waitingUsers.length}</Badge>
              : null
          }
        </Button>
      );
    } else {
      const userStatus = getParticipantStatus(favor.status);
      lastTdContent = <span className={userStatus.className}>{userStatus.wording}</span>;
    }

    // check si la favor est accepté
    if (favor.favor.status === 1) {
      return (
        <tr key={favor.favor.id}>
          <td>{favor.favor.title}</td>
          <td>
            {`${dayjs(favor.favor.dateStart).format('MM/DD/YYYY')} - ${dayjs(favor.favor.dateEnd).format('MM/DD/YYYY')}`}
          </td>
          <td>
            {`${subscribeds.length} / ${favor.favor.placeLimit}`}
          </td>
          <td>{lastTdContent}</td>
        </tr>
      );
    }
    return null;
  };

  const renderFavors = () => {
    if (active === 1) {
      return userFavors.currents.map((favor: any) => renderFavorTableBody(favor, favor.isOwner));
    }
    if (active === 2) {
      return userFavors.pasts.map((favor: any) => renderFavorTableBody(favor));
    }
    return null;
  };

  return (
    <Layout>
      <UserModal
        modal={modal}
        toggleModal={toggleModal}
        users={favorUsers}
      />

      <Breadcrumb items={[{ label: 'Historique de mes services' }]} />

      {
        favors && favors.results && favors.results[0].length >= 1
          ? (
            <div className="history p-3 mt-2 rounded">
              <div>
                <Button onClick={(): void => toggleRender(1)} outline={active !== 1} color="primary" className="mr-3">Services en cours</Button>
                <Button onClick={(): void => toggleRender(2)} outline={active !== 2} color="primary" className="mr-3">Services passés</Button>
              </div>

              <Table striped className="mt-4">
                <thead>
                  <tr>
                    <th>Titre du service</th>
                    <th>Date du service</th>
                    <th>Inscrits</th>
                  </tr>
                </thead>
                <tbody>
                  {renderFavors()}
                </tbody>
              </Table>

            </div>
          )
          : (
            <div className="text-center mt-2">
              <div className="mb-3">Vous n'avez pas encore participé où crée de service à ce jour.</div>
              <Link to={ROUTES.NEW_FAVOR} className="service-btn btn btn-secondary">Proposer un service</Link>
            </div>
          )
      }
    </Layout>
  );
};

export default History;
