import React, { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { FormGroup, Input as BootstrapInput, Label } from 'reactstrap';
import { FormField } from '../../models/FormModel';
import { setImagesPreview } from '../../actions/formAction';

type Props = {
  field: FormField;
}

const InputFile: React.FC<Props> = ({ field }: Props) => {
  const dispatch = useDispatch();

  const previewImage = (e: ChangeEvent): void => {
    const inputFile = e.target as HTMLInputElement;
    if ('files' in inputFile && inputFile.files) {
      if (inputFile.files.length > 0) {
        const imagesUrl = Array.from(inputFile.files).map((file) => URL.createObjectURL(file));
        dispatch(setImagesPreview(imagesUrl));
      }
    }
  };

  return (
    <FormGroup>
      <Label for={`${field.key}-field`} className={field.required ? 'required' : ''}>{field.label}</Label>
      <BootstrapInput
        type="file"
        name={field.key}
        id={`${field.key}-field`}
        required={field.required}
        pattern={field.validation ? field.validation : undefined}
        onChange={(e: ChangeEvent): void => previewImage(e)}
        multiple={field.type === '[file]'}
      />
    </FormGroup>
  );
};

export default InputFile;
