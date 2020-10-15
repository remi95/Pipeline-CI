import React, {
  FormEvent, useEffect,
} from 'react';
import { Col, Row } from 'reactstrap';
import './Register.scss';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { register, setUserLoading } from '../../actions/userAction';
import ROUTES from '../../config/routes';
import { setFlashMessage } from '../../actions/appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';
import Form from '../../components/Form/Form';
import { FORM } from '../../models/FormModel';
import Loader from '../../components/Loader';
import ImagePreview from '../../components/Form/ImagePreview';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const Register: React.FC = () => {
  const { user, isLoading } = useSelector((state: RootStateOrAny) => state.user);
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
    dispatch(setUserLoading(true));
    dispatch(register(data));
  };

  return (
    <Layout>
      <Breadcrumb items={[{ label: 'Inscription' }]} />

      <div className="form-container">
        <h1>Créer un compte</h1>

        <Row>
          <Col xs={12} md={{ size: 8 }}>
            <Form
              onSubmit={(e: FormEvent): void => sendForm(e)}
              formName={FORM.REGISTER}
              btnLabel="S'inscrire"
              nbColumn={2}
              isAuthForm
            />
          </Col>

          <Col xs={12} md={{ size: 4 }}>
            <ImagePreview />
          </Col>
        </Row>

        { isLoading ? <Loader /> : null }
      </div>
    </Layout>
  );
};

export default Register;
