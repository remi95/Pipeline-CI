import { InputType } from 'reactstrap/lib/Input';

type CustomInputType =
  | '[file]'
  | 'custom';

export enum FORM {
  LOGIN = 'login',
  REGISTER = 'register',
  FAVOR = 'favor',
  REQUEST = 'request',
}

export interface FormField {
  key: string;
  label?: string;
  type: InputType | CustomInputType;
  validation?: string;
  required: boolean;
  hint?: string;
  select?: Record<number, string>;
}

export type FieldCollection = FormField[];

export interface FormStep {
  label: string;
  fieldsKeys: string[];
}
