import React, { FormEvent, useEffect, useState } from 'react';
import {
  Button, Col, Form as BootstrapForm, Row,
} from 'reactstrap';
import { FieldCollection, FORM, FormField } from '../../models/FormModel';
import { getForm } from '../../helpers/FormHelper';
import Loader from '../Loader';
import Field from './Field';

type NbColumn = 1|2|3|4|6|12;

type Props = {
  formName: FORM;
  onSubmit: Function;
  btnLabel?: string;
  btnFloatRight?: boolean;
  nbColumn?: NbColumn;
  isAuthForm?: boolean;
}

const Form: React.FC<Props> = (props: Props) => {
  const {
    formName, onSubmit, btnLabel, btnFloatRight, nbColumn, isAuthForm,
  } = props;
  const [form, setForm] = useState<FieldCollection[]>([]);

  /**
   * Split form fields to display them by column.
   */
  const orderFieldsByColumn = (formData: FieldCollection): void => {
    const nbFields = formData.length;
    const nbFieldByColumn = Math.trunc(nbFields / (nbColumn as NbColumn));
    const formattedForm = [];
    let count = 0;

    while (count < nbFields) {
      const column = formData.slice(count, count + nbFieldByColumn);
      formattedForm.push(column);
      count += nbFieldByColumn;
    }

    setForm(formattedForm);
  };

  /**
   * Get form data from API.
   */
  const getFormData = async (): Promise<void> => {
    const formData = await getForm(formName, isAuthForm);

    if (Array.isArray(formData)) {
      orderFieldsByColumn(formData);
    } else {
      setForm([]);
    }
  };

  useEffect(() => {
    getFormData();
  }, []);

  if (form.length <= 0) {
    return <Loader />;
  }

  return (
    <BootstrapForm onSubmit={(e: FormEvent): void => onSubmit(e)}>
      <Row>
        {
          form.map((fieldCollection: FieldCollection) => (
            <Col xs={12} md={{ size: 12 / (nbColumn as NbColumn) }} key={`field_collection_${fieldCollection[0].key}`}>
              {
                fieldCollection.map((field: FormField) => (
                  <Field field={field} key={field.key} />
                ))
              }
            </Col>
          ))
        }
      </Row>

      <Button type="submit" className={`${btnFloatRight ? 'float-right' : ''}`}>{btnLabel}</Button>
    </BootstrapForm>
  );
};

Form.defaultProps = {
  btnLabel: 'Envoyer',
  btnFloatRight: false,
  nbColumn: 1,
  isAuthForm: false,
};

export default Form;
