import React, { ComponentClass, FunctionComponent } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import ROUTES from '../../config/routes';
import { setFlashMessage } from '../../actions/appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';

type Props = {
  path: string;
  component: ComponentClass|FunctionComponent;
  exact?: boolean;
}

const PrivateRoute: React.FC<Props> = (props: Props) => {
  const { path, component, exact } = props;
  const isAuth = useSelector((state: RootStateOrAny) => state.user.user);
  const dispatch = useDispatch();

  if (!isAuth) {
    dispatch(setFlashMessage('Vous n\'êtes pas autorisé à accéder à cette page.', FlashMessageType.WARNING));
    return <Redirect to={{ pathname: ROUTES.LOGIN }} />;
  }

  return (
    <Route path={path} component={component} exact={exact} />
  );
};

PrivateRoute.defaultProps = {
  exact: false,
};

export default PrivateRoute;
