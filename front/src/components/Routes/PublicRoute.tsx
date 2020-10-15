import React, { ComponentClass, FunctionComponent } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import ROUTES from '../../config/routes';

type Props = {
  path: string;
  component: ComponentClass|FunctionComponent;
  exact?: boolean;
}

const PublicRoute: React.FC<Props> = (props: Props) => {
  const { path, component, exact } = props;
  const isAuth = useSelector((state: RootStateOrAny) => state.user.user);

  if (isAuth) {
    return <Redirect to={{ pathname: ROUTES.HOME }} />;
  }

  return (
    <Route path={path} component={component} exact={exact} />
  );
};

PublicRoute.defaultProps = {
  exact: false,
};

export default PublicRoute;
