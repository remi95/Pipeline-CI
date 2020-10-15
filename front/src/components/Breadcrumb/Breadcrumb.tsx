import React from 'react';
import { Link } from 'react-router-dom';
import { BreadcrumbItem } from '../../models/BreadcrumbModel';
import ROUTES from '../../config/routes';

type Props = {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<Props> = (props: Props) => {
  const { items } = props;

  return (
    <div className="pt-3 pb-2 d-flex align-items-center justify-content-between">
      <div>
        <Link to={ROUTES.HOME}>Accueil</Link>
        {
          items.map((item: BreadcrumbItem) => (
            <span key={item.label}>
              {' > '}
              {
                'link' in item
                  ? <Link to={item.link!}>{item.label}</Link>
                  : <span>{item.label}</span>
              }
            </span>
          ))
        }
      </div>
    </div>
  );
};

export default Breadcrumb;
