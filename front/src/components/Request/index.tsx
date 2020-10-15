import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, CardBody, Card, CardText, CardHeader, Alert,
} from 'reactstrap';
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai';
import './Request.scss';
import { Request } from '../../models/RequestModel';
import ROUTES from '../../config/routes';
import { City } from '../../models/GeoModel';
import { RootStateOrAny, useSelector } from 'react-redux';

type Props = {
  request: Request;
}

const maxDescriptionLength = 200;

const RequestCard: React.FC<Props> = (props: Props) => {
  const { request } = props;
  const { title, content } = request;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [itemContent, setItemContent] = useState('');
  const [userIsOwner, setUserIsOwner] = useState<boolean>(false);
  const user = useSelector((state: RootStateOrAny) => state.user.user);

  const sliceContent = (): string => `${content.slice(0, maxDescriptionLength)} [...]`;

  const toggle = (): void => {
    if (itemContent.length > maxDescriptionLength) {
      if (isCollapsed) {
        setItemContent(sliceContent());
        setIsCollapsed(false);
      } else {
        setItemContent(content);
        setIsCollapsed(true);
      }
    }
  };

  useEffect(() => {
    let newContent = content;
    if (content.length > maxDescriptionLength) {
      newContent = sliceContent();
    }
    setItemContent(newContent);
  }, [content]);

  useEffect(() => {
    if (user && request) {
      if (user.id === request.user.id) {
        setUserIsOwner(true);
      }
    }
  }, [user, request]);

  return (
    <Card className="request-card mb-3" key={title}>
      <CardHeader onClick={toggle}>
        {title}
        <div className="icons">
          {
            isCollapsed
              ? <AiFillMinusCircle />
              : <AiFillPlusCircle />
          }
        </div>
      </CardHeader>
      <CardBody>
        <CardText className="mb-1 text-justify">
          {itemContent}
        </CardText>
        {
          itemContent.length > maxDescriptionLength
            ? (
              <Button
                color="link"
                className="p-0"
                onClick={toggle}
              >
                {
                  isCollapsed
                    ? 'Voir moins'
                    : 'Voir plus'
                }
              </Button>
            )
            : null
        }
        <blockquote className="blockquote mt-2">
          <footer className="blockquote-footer">
            {request.user.firstname}
            {' '}
            <cite title="Source Title">
              {request.cities.map((city: City) => `- ${city.name}`)}
            </cite>
          </footer>
        </blockquote>

        {
          userIsOwner
            ? (
              <Alert color="info">Cette demande est la vôtre, vous n'avez plus qu'à attendre :)</Alert>
            )
            : <Link to={ROUTES.NEW_FAVOR} className="btn btn-secondary">Répondre à cette demande</Link>
        }
      </CardBody>
    </Card>
  );
};

export default RequestCard;
