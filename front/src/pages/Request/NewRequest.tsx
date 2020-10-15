import React, { useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import FormMultiStep from '../../components/Form/FormMultiStep';
import { FORM } from '../../models/FormModel';
import { FORM_STEPS } from '../../config/forms';
import ImagePreview from '../../components/Form/ImagePreview';
import Layout from '../../components/Layout/Layout';
import { postRequest } from '../../actions/request';
import ROUTES from '../../config/routes';
import { setFlashMessage } from '../../actions/appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';
import { POST_REQUEST } from '../../actions/request/type';
import Loader from '../../components/Loader';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const NewRequest: React.FC = () => {
  const { request, isLoading } = useSelector((state: RootStateOrAny) => state.request);
  const history = useHistory();
  const dispatch = useDispatch();

  /**
   * Handle after post favor behavior.
   */
  useEffect(() => {
    if (request) {
      history.push(ROUTES.REQUESTS);
      dispatch(setFlashMessage(
        `Votre demande "${request.title}" a bien été créée, vous n'avez plus qu'à attendre une âme charitable !`,
        FlashMessageType.SUCCESS,
        10000,
      ));
    }

    return (): any => dispatch({ type: POST_REQUEST, payload: null });
  }, [request]);

  const onSubmit = (data: FormData): void => {
    dispatch(postRequest(data));
  };

  return (
    <Layout>
      <Breadcrumb items={[{ label: 'Demander un nouveau service' }]} />

      <h1 className="ml-5 mt-4">
        Faire une
        <span className="text-secondary"> demande</span>
      </h1>

      <Row>
        <Col xs={12} md={8}>
          <FormMultiStep
            formName={FORM.REQUEST}
            steps={FORM_STEPS.REQUEST}
            onSubmit={(data: FormData): void => onSubmit(data)}
          />
        </Col>
        <Col xs={12} md={4} className="my-4">
          <ImagePreview />
        </Col>

        { isLoading ? <Loader /> : null }
      </Row>
    </Layout>
  );
};

export default NewRequest;
