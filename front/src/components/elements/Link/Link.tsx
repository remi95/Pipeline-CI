import React, { ReactElement } from 'react';
import { Link as ReactLink } from 'react-router-dom';
import { formatRoute } from '../../../helpers/NavigationHelper';

interface Props {
  to: string;
  params: Record<string, string|number>;
  children: ReactElement|string;
}

const Link: React.FC<Props> = (props: Props) => {
  const { to, params, children } = props;

  return (
    <ReactLink to={formatRoute(to, params)}>{children}</ReactLink>
  );
};

export default Link;
