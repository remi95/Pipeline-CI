import React, { ReactElement, useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { SENTRY_ID, SENTRY_TOKEN } from '../../parameters';
import { checkUser } from '../../actions/userAction';
import Loader from '../Loader';
import { LOCAL_STORAGE_DEPARTMENT } from '../../config/map';
import { setHasGeoZone } from '../../actions/appAction';
import ChooseGeozone from '../../pages/ChooseGeozone/ChooseGeozone';

type Props = {
  children: ReactElement | ReactElement[];
}

const AppLayout: React.FC<Props> = (props: Props) => {
  const { children } = props;
  const isUserChecked = useSelector((state: RootStateOrAny) => state.user.userChecked);
  const hasChooseGeoZone = useSelector((state: RootStateOrAny) => state.app.hasChooseGeoZone);
  const dispatch = useDispatch();

  useEffect(() => {
    Sentry.init({ dsn: `https://${SENTRY_TOKEN}@sentry.io/${SENTRY_ID}` });
    dispatch(checkUser());
    dispatch(setHasGeoZone(localStorage.getItem(LOCAL_STORAGE_DEPARTMENT) !== null));
  }, []);

  const renderApp = (): ReactElement | ReactElement[] => {
    if (!hasChooseGeoZone) {
      return <ChooseGeozone />;
    }

    return children;
  };

  return (
    <div className="App">
      <Router>
        {
          isUserChecked
            ? renderApp()
            : (
              <div className="text-center">
                <Loader />
              </div>
            )
        }
      </Router>
    </div>
  );
};

export default AppLayout;
