import React, { ReactElement, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  Alert, Badge, Button,
} from 'reactstrap';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { FaRegCalendarAlt, FaUserCircle } from 'react-icons/fa';
import './Favor.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Favor as FavorModel } from '../../models/FavorModel';
import { fetchData } from '../../helpers/ApiHelper';
import { FAVOR_DETAIL_URL, POST_FAVOR_URL } from '../../config/api';
import { City } from '../../models/GeoModel';
import Carousel from '../../components/Carousel/Carousel';
import { Participant, ParticipantStatus, User } from '../../models/UserModel';
import Comments from '../../components/Comments/Comments';
import { formatDateToLiteral } from '../../helpers/GenericHelper';
import ConcertoMap from '../../components/map/ConcertoMap/ConcertoMap';
import { fetchCities } from '../../actions/mapAction';
import Layout from '../../components/Layout/Layout';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import ROUTES from '../../config/routes';

const Favor: React.FC = () => {
  const params = useParams<{ id: string }>();
  const location = useLocation<{ favor: FavorModel }>();
  const [favor, setFavor] = useState<FavorModel | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [owner, setOwner] = useState<User | null>(null);
  const [userIsOwner, setUserIsOwner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSubscribed, setUserSubscribed] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const user = useSelector((state: RootStateOrAny) => state.user.user);
  const dispatch = useDispatch();

  const fetchFavor = async (): Promise<void> => {
    const response = await fetchData(`${FAVOR_DETAIL_URL}/${params.id}`);

    if (Array.isArray(response) && response.length > 0) {
      setFavor(response[0]);
    }
  };

  useEffect(() => {
    dayjs.locale('fr');

    if (location.state && 'favor' in location.state) {
      setFavor(location.state.favor);
    } else {
      fetchFavor();
    }
  }, [location]);

  useEffect(() => {
    if (favor) {
      dispatch(fetchCities(favor.cities));

      if (favor.users && favor.users.length > 0) {
        const subscribedUsers = favor.users.filter((participant) => !participant.isOwner);
        setParticipants(subscribedUsers);

        const favorOwner = favor.users.find((participant) => participant.isOwner);

        if (favorOwner !== undefined) {
          setOwner(favorOwner.user);
          if (user && user.id === favorOwner.user.id) {
            setUserIsOwner(true);
          }
        }

        if (user) {
          const favorUser = favor.users.find((participant) => participant.user.id === user.id);
          setUserSubscribed(favorUser !== undefined);
        }
      }
    }
  }, [favor]);

  const subscribedToFavor = async (): Promise<void> => {
    if (favor) {
      try {
        setIsLoading(true);
        await fetchData(`${POST_FAVOR_URL}/apply/${favor.id}`);
        setIsSubscribing(true);
      } catch (e) {
        setIsLoading(false);
      }
    }
  };

  const getAcceptedParticipants = (): Participant[] => participants.filter((participant) => (
    participant.status === ParticipantStatus.ACCEPTED
  ));

  const getWaitingParticipants = (): Participant[] => participants.filter((participant) => (
    participant.status === ParticipantStatus.WAITING
  ));

  const renderCities = (): string | null => {
    if (favor && favor.cities) {
      const firstCities = favor.cities.slice(0, 3).map((city: City) => city.name);
      let sentence = `À ${firstCities.join(', ')}`;

      if (favor.cities.length > 3) {
        sentence = `${sentence}, et ${favor.cities.length - 3} autres`;
      }
      return `${sentence}.`;
    }
    return null;
  };

  const renderFavorAction = (): ReactElement => {
    if (userIsOwner) {
      return (
        (
          <Alert color="info">
            Administrez vos services depuis la
            <Link to={ROUTES.HISTORY}>{' page d\'administration.'}</Link>
          </Alert>
        )
      );
    }

    return (
      <>
        <Alert color="warning">
          Attention, seul le propriétaire décide des personnes qui bénificieront de son service.
        </Alert>

        {
          isSubscribing
            ? (
              <Alert color="success">
                Votre souscription à ce service à bien été prise en compte.
                <br />
                Rendez vous sur
                {' '}
                <Link to={ROUTES.HISTORY}>la page d'administration </Link>
                pour vérifier le statut de votre souscription.
              </Alert>
            )
            : null
        }

        {
          !userSubscribed
            ? <Button color="primary" disabled={isLoading} onClick={subscribedToFavor}>Souscrire</Button>
            : (
              <div>
                <span className="text-danger">Vous avez déjà souscrit à ce service.</span>
                <div className="mt-1">
                  Pour vérifier le statut de votre souscription, vous pouvez vous rendre sur
                  {' '}
                  <Link to={ROUTES.HISTORY}>la page d'administration.</Link>
                </div>
              </div>
            )
        }
      </>
    );
  };

  return (
    <Layout>
      <Breadcrumb
        items={[
          { label: 'Services', link: ROUTES.FAVORS },
          { label: favor && favor.title ? favor.title : 'Détail' },
        ]}
      />

      <div className="pt-5">
        <h1>{favor?.title}</h1>

        <div className="clearfix">
          <div className="float-right mt-5 mb-3">
            Proposé par
            <strong>{` ${owner?.firstname} ${owner?.lastname}`}</strong>
          </div>
        </div>

        <div className="d-flex justify-content-between mb-5">
          <div>
            <Badge color="secondary">{favor?.category.name}</Badge>
          </div>
          <div>
            <FaRegCalendarAlt size={20} className="mr-2" />
            <span>{`Entre le ${formatDateToLiteral(favor?.dateStart)} et le ${formatDateToLiteral(favor?.dateEnd)}`}</span>
          </div>
        </div>

        <div>{renderCities()}</div>

        <p className="my-4">{favor?.content}</p>

        <Carousel pictures={favor?.pictures || []} />

        <div className="my-5">
          <strong>Le service est disponible dans les villes suivantes</strong>
          <ConcertoMap displayCities height={400} />
        </div>

        <div className="border-box primary">
          <div>
            <FaUserCircle size={20} className="mr-2" />
            <span>{`${getAcceptedParticipants().length} / ${favor?.placeLimit} bénéficiaires`}</span>
          </div>

          <div className="my-3">{`${getWaitingParticipants().length} bénéficiaire(s) en attente.`}</div>
          {
            user
              ? renderFavorAction()
              : (
                <Alert color="info">
                  <Link to={ROUTES.LOGIN}>Connectez-vous </Link>
                  pour bénéficier de ce service !
                </Alert>
              )
          }
        </div>

        {
          favor
            ? <Comments comments={favor.comments ? favor.comments : []} favorId={favor.id} />
            : null
        }
      </div>
    </Layout>
  );
};

export default Favor;
