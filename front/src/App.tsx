import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import ROUTES from './config/routes';
import Home from './pages/Home';
import ChooseGeozone from './pages/ChooseGeozone/ChooseGeozone';
import Favor from './pages/Favor/Favor';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PublicRoute from './components/Routes/PublicRoute';
import RequestList from './pages/Request/List';
import Profil from './pages/Profil';
import PrivateRoute from './components/Routes/PrivateRoute';
import Favors from './pages/Favor/Favors';
import History from './pages/History/History';
import ModalSurprise from './components/ModalSurprise/ModalSurprise';
import NewFavor from './pages/Favor/NewFavor';
import AppLayout from './components/Layout/AppLayout';
import NewRequest from './pages/Request/NewRequest';

const App: React.FC = () => (
  <AppLayout>
    <ModalSurprise />

    <Switch>
      <Route path={ROUTES.HOME} exact component={Home} />
      <Route path={ROUTES.REGION} component={ChooseGeozone} />

      <Route path={ROUTES.FAVORS} exact component={Favors} />
      <PrivateRoute path={ROUTES.NEW_FAVOR} exact component={NewFavor} />
      <Route path={ROUTES.FAVOR_DETAIL} component={Favor} />

      <Route path={ROUTES.REQUESTS} exact component={RequestList} />
      <PrivateRoute path={ROUTES.NEW_REQUEST} exact component={NewRequest} />

      <PublicRoute path={ROUTES.LOGIN} component={Login} />
      <PublicRoute path={ROUTES.REGISTER} component={Register} />

      <PrivateRoute path={ROUTES.PROFIL} component={Profil} />
      <PrivateRoute path={ROUTES.HISTORY} component={History} />
    </Switch>
  </AppLayout>
);

export default App;
