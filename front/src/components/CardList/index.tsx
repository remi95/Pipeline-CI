import React from 'react';
import { Row, Col } from 'reactstrap';
import FavorCard from '../Cards/Favor/FavorCard';
import RequestCard from '../Cards/Request/RequestCard';

type CardProps = {
  items: any;
  col: number;
}

const isFavor = (item: any): boolean => (item.users !== undefined);

const CardList = (props: CardProps) => {
  const { items, col } = props;

  const renderList = () => items.map((item: any) => {
    let user = null;
    if (isFavor(item)) {
      const admin = item.users.filter((participant: any) => participant.isOwner);
      user = admin[0].user;
    } else {
      user = item.user;
    }

    return (
      <Col
        className="col p-3"
        key={`${item.id}_${item.title}`}
        md={col}
      >
        {
          isFavor(item)
            ? <FavorCard favor={item} user={user} />
            : <RequestCard request={item} user={user} />
        }
      </Col>
    );
  });

  return (
    <Row className="card-lists">
      {renderList()}
    </Row>
  );
};

export default CardList;
