import React, { ReactElement } from 'react';
import {
  Card, CardText, CardBody, CardTitle,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import ROUTES from '../../../config/routes';
import './Request.scss';
import { formatRoute } from '../../../helpers/NavigationHelper';
import { User } from '../../../models/UserModel';
import { Request } from '../../../models/RequestModel';
import { City } from '../../../models/GeoModel';

type Props = {
  request: Request;
  user: User;
}

const RequestCard = (props: Props): ReactElement => {
  const { request, user } = props;
  const history = useHistory();

  const navigateToRequest = (): void => {
    history.push(
      formatRoute(ROUTES.REQUEST_DETAIL, { id: request.id }),
      { request },
    );
  };

  return (
    <Card className="card-service" onClick={(): void => navigateToRequest()}>
      <div
        className="bg-img"
        style={{ backgroundImage: `url(${request.category.picture ? request.category.picture.path : ''})` }}
      />
      <CardBody>
        <CardTitle>
          <span className="font-weight-bold">{request.title}</span>
        </CardTitle>
        <CardText>
          {
            user.picture
              ? <img src={user.picture.path} className="rounded" alt={`${user.firstname} ${user.lastname}`} />
              : null
          }
          <span>{`${user.firstname} ${user.lastname}`}</span>

          { request.cities.map((city: City) => (<span key={city.id}>{`${city.postalCode} ${city.name}`}</span>)) }
        </CardText>
      </CardBody>
    </Card>
  );
};

export default RequestCard;
