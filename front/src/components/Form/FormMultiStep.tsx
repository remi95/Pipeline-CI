import React, { useEffect, useState } from 'react';
import { Button } from 'reactstrap';
import {
  FieldCollection, FORM, FormField, FormStep as FormStepModel,
} from '../../models/FormModel';
import { getForm } from '../../helpers/FormHelper';
import FormStep from './FormStep';

type Props = {
  formName: FORM;
  steps: FormStepModel[];
  onSubmit: Function;
}

const FormMultiStep: React.FC<Props> = (props: Props) => {
  const { formName, steps } = props;
  const [form, setForm] = useState<FieldCollection>([]);
  const [stepsFields, setStepsFields] = useState<FieldCollection[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData[]>([]);

  /**
   * Get form data from API.
   */
  const getFormData = async (): Promise<void> => {
    const formData = await getForm(formName);

    return Array.isArray(formData) ? setForm(formData) : setForm([]);
  };

  useEffect(() => {
    getFormData();
  }, []);

  /**
   * Separate form to steps.
   */
  useEffect(() => {
    if (Array.isArray(form) && form.length > 0) {
      const fieldsByStep = steps.map((step: FormStepModel) => (
        form.filter((field: FormField) => step.fieldsKeys.includes(field.key))
      ));

      setStepsFields(fieldsByStep);
    }
  }, [form]);

  const onPrevious = (): void => {
    setCurrentStep(currentStep - 1);

    const previousFormData = formData;
    previousFormData.pop();
    setFormData(previousFormData);
  };

  const onSubmit = (allStepsData: FormData[]): void => {
    const data = new FormData();

    // Merge all step FormData into only one FormData.
    allStepsData.forEach((stepFormData: FormData) => {
      for (const [key, value] of stepFormData.entries()) {
        data.append(key, value);
      }
    });

    props.onSubmit(data);
  };

  const addFormData = (stepData: FormData): void => {
    const data = [...formData, stepData];
    setFormData(data);

    if (currentStep === steps.length - 1) {
      onSubmit(data);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };


  return (
    <div className="form-container">
      <div>
        {
          stepsFields.map((fieldCollection: FieldCollection, index: number) => (
            <FormStep
              key={`form_step_${index}`}
              label={steps[index].label}
              fields={fieldCollection}
              index={index}
              currentStep={currentStep}
              formLength={steps.length}
              addFormData={(data: FormData): void => addFormData(data)}
            />
          ))
        }

        <div className="d-flex justify-content-between">
          <Button
            color="secondary"
            outline
            onClick={(): void => onPrevious()}
            className={currentStep <= 0 ? 'invisible' : ''}
          >
            Retour
          </Button>
        </div>

        <div className="indicators">
          {
            steps.map((step: FormStepModel, index: number) => (
              <div key={`bullet_${index}`} className={`bullet-indicator ${index === currentStep ? 'active' : ''}`} />
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default FormMultiStep;
