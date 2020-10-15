import React, { FormEvent, useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login } from '../../actions/userAction';
import ROUTES from '../../config/routes';
import { setFlashMessage } from '../../actions/appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';
import Layout from '../../components/Layout/Layout';
import Form from '../../components/Form/Form';
import { FORM } from '../../models/FormModel';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const Login: React.FC = () => {
  const user = useSelector((state: RootStateOrAny) => state.user.user);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (user && user.apiToken) {
      history.push(ROUTES.HOME);
      dispatch(setFlashMessage(`Bonjour ${user.firstname} ! :)`, FlashMessageType.SUCCESS));
    }
  }, [user]);

  const sendForm = (e: FormEvent): void => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    dispatch(login(data));
  };

  return (
    <Layout>
      <Breadcrumb items={[{ label: 'Connexion' }]} />

      <div className="form-container">
        <h1 className="text-center">Se connecter</h1>

        <Row>
          <Col xs={12} md={{ size: 6, offset: 3 }}>
            <Form
              formName={FORM.LOGIN}
              onSubmit={(e: FormEvent): void => sendForm(e)}
              btnLabel="Se connecter"
              btnFloatRight
              isAuthForm
            />
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Login;
