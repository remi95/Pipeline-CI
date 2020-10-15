import React, { ReactElement } from 'react';
import {
  Card, CardText, CardBody, CardTitle,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { Favor } from '../../../models/FavorModel';
import ROUTES from '../../../config/routes';
import './FavorCard.scss';
import { formatRoute } from '../../../helpers/NavigationHelper';
import { User, Participant } from '../../../models/UserModel';
import UserPlaceholder from '../../../assets/images/user.png';
import { BASE_URL } from '../../../config/api';

type FavorProps = {
  favor: Favor;
  user: User;
}

const FavorCard = (props: FavorProps): ReactElement => {
  const { favor, user } = props;
  const { cities } = favor;
  const history = useHistory();

  const navigateToFavor = (): void => {
    history.push(
      formatRoute(ROUTES.FAVOR_DETAIL, { id: favor.id }),
      { favor },
    );
  };

  const getBackground = (): object => {
    if (favor.pictures.length > 0) {
      return { backgroundImage: `url(${BASE_URL}${favor.pictures[0].path})` };
    }

    return { backgroundColor: '#7c84e4' };
  };

  const owner = favor.users.filter((item: Participant) => item.isOwner)[0].user;

  return (
    <Card className="card-service" onClick={(): void => navigateToFavor()}>
      <div
        className="bg-img"
        style={getBackground()}
      />
      <CardBody>
        <CardTitle>
          <span className="font-weight-bold">{favor.title}</span>
        </CardTitle>
        <CardText>
          {
            owner && owner.picture !== undefined
              ? <img src={owner.picture ? BASE_URL + owner.picture.path : UserPlaceholder} className="rounded" alt={`${user.firstname} ${user.lastname}`} />
              : null
          }
          <span>{`${user.firstname} ${user.lastname}`}</span>
          <span>{`${cities[0].postalCode} ${cities[0].name}`}</span>
        </CardText>
      </CardBody>
    </Card>
  );
};

export default FavorCard;
