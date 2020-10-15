import React, { FormEvent } from 'react';
import { Button, Form as BootstrapForm } from 'reactstrap';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { FieldCollection } from '../../models/FormModel';
import Field from './Field';
import { setFlashMessage } from '../../actions/appAction';
import { FlashMessageType } from '../../models/FlashMessageModel';

type Props = {
  label: string;
  fields: FieldCollection;
  index: number;
  currentStep: number;
  formLength: number;
  addFormData: Function;
}

const FormStep: React.FC<Props> = (props: Props) => {
  const {
    label, fields, index, currentStep, formLength,
  } = props;
  const customFieldsData = useSelector((state: RootStateOrAny) => state.form.customFieldsData);
  const dispatch = useDispatch();

  /**
   * Check if required custom fields are filled.
   */
  const areCustomFieldsValid = (): boolean => {
    const customFields = fields.filter((field) => field.type === 'custom');
    if (customFields.length <= 0) {
      return true;
    }

    const validFields = customFields.map((field) => {
      if (!field.required) return true;
      if (!(field.key in customFieldsData) || !customFieldsData[field.key]) {
        return false;
      }
      if (
        (Array.isArray(customFieldsData[field.key]) || typeof customFieldsData[field.key] === 'string')
        && customFieldsData[field.key].length <= 0
      ) {
        return false;
      }
      if (typeof customFieldsData[field.key] === 'object' && Object.keys(customFieldsData[field.key]).length <= 0) {
        return false;
      }

      return true;
    });

    return validFields.filter((isValid) => !isValid).length === 0;
  };

  /**
   * Add custom field data to FormData.
   */
  const addCustomFieldData = (formData: FormData): FormData => {
    const customFields = fields.filter((field) => field.type === 'custom');

    customFields.forEach((field) => {
      const value = customFieldsData[field.key];

      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(field.key, JSON.stringify(customFieldsData[field.key]));
      } else {
        formData.append(field.key, customFieldsData[field.key]);
      }
    });

    return formData;
  };

  /**
   * Check if step form is valid and send it to parent.
   */
  const handleFormSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (!areCustomFieldsValid()) {
      dispatch(setFlashMessage('Veuillez remplir tous les champs requis correctement.', FlashMessageType.DANGER));
      return;
    }

    let data = new FormData(e.target as HTMLFormElement);
    data = addCustomFieldData(data);

    props.addFormData(data);
  };

  return (
    <BootstrapForm
      className={index !== currentStep ? 'd-none' : ''}
      onSubmit={(e: FormEvent): void => handleFormSubmit(e)}
    >
      <div className="mb-4">
        <strong>{label}</strong>
      </div>

      {
        fields.map((field) => (
          <Field field={field} key={field.key} />
        ))
      }

      <Button color="primary" className="float-right">
        {currentStep === formLength - 1 ? 'Soumettre' : 'Continuer'}
      </Button>
    </BootstrapForm>
  );
};

export default FormStep;
