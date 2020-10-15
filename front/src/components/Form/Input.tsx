import React, { ChangeEvent } from 'react';
import { FormGroup, Label, Input as BootstrapInput } from 'reactstrap';
import dayjs from 'dayjs';
import { InputType } from 'reactstrap/lib/Input';
import { FormField } from '../../models/FormModel';

type Props = {
  field: FormField;
}

const Input: React.FC<Props> = ({ field }: Props) => {
  const setCustomValidity = (e: ChangeEvent<HTMLInputElement>): void => {
    if (field.hint && field.validation) {
      if (!e.target.value.match(field.validation)) {
        e.target.setCustomValidity(field.hint);
      } else {
        e.target.setCustomValidity('');
      }
    }
  };

  return (
    <FormGroup>
      <Label for={`${field.key}-field`} className={field.required ? 'required' : ''}>{field.label}</Label>
      <BootstrapInput
        id={`${field.key}-field`}
        type={field.type as InputType}
        name={field.key}
        required={field.required}
        pattern={field.validation ? field.validation : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>): void => setCustomValidity(e)}
      >
        {
          field.select
            ? Object.entries(field.select).map(([key, value]) => (
              <option key={`${field.key}_${key}`} value={key}>{value}</option>
            ))
            : null
        }
      </BootstrapInput>
    </FormGroup>
  );
};

export default Input;
