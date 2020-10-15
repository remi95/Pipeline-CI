import React, { useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import FormMultiStep from '../../components/Form/FormMultiStep';
import { FORM } from '../../models/FormModel';
import { FORM_STEPS } from '../../config/forms';
import ImagePreview from '../../components/Form/ImagePreview';
import { POST_FAVOR } from '../../actions/favor/type';
import Loader from '../../components/Loader';
import { postFavor } from '../../actions/favor';
import ROUTES from '../../config/routes';
import { setFlashMessage } from '../../actions/appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

const NewFavor: React.FC = () => {
  const { favor, isLoading } = useSelector((state: RootStateOrAny) => state.favorReducer);
  const history = useHistory();
  const dispatch = useDispatch();

  /**
   * Handle after post favor behavior.
   */
  useEffect(() => {
    if (favor) {
      history.push(ROUTES.HOME);
      dispatch(setFlashMessage(
        `Votre service "${favor.title}" a bien été créé, il va passer sous contrôle, puis sera visible dans les plus brefs délais.`,
        FlashMessageType.SUCCESS,
        10000,
      ));
    }

    return (): any => dispatch({ type: POST_FAVOR, payload: null });
  }, [favor]);

  const onSubmit = (data: FormData): void => {
    dispatch(postFavor(data));
  };

  return (
    <Layout>
      <Breadcrumb items={[{ label: 'Proposer un nouveau service' }]} />

      <h1 className="ml-5 mt-4">
        Proposer un nouveau
        <span className="text-primary"> service</span>
      </h1>

      <Row>
        <Col xs={12} md={8}>
          <FormMultiStep
            formName={FORM.FAVOR}
            steps={FORM_STEPS.FAVOR}
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

export default NewFavor;
