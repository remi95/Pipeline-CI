import React from 'react';
import { FormField } from '../../models/FormModel';
import InputFile from './InputFile';
import Input from './Input';
import CustomField from './CustomField';

type Props = {
  field: FormField;
}

const Field: React.FC<Props> = (props: Props) => {
  const { field } = props;

  switch (field.type) {
    case 'file':
    case '[file]':
      return <InputFile field={field} />;
    case 'custom':
      return <CustomField field={field} />;
    default:
      return <Input field={field} />;
  }
};

export default Field;
