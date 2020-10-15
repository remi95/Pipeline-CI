import React from 'react';
import { FormField } from '../../models/FormModel';
import AutocompleteCities from './AutocompleteCities';

type Props = {
  field: FormField;
}

const CustomField: React.FC<Props> = (props: Props) => {
  const { field } = props;

  switch (field.key) {
    case 'cities':
      return <AutocompleteCities field={field} />;
    default:
      return null;
  }
};

export default CustomField;
