import React, { useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { clearImagesPreview } from '../../actions/formAction';

const ImagePreview: React.FC = () => {
  const imagesPreview = useSelector((state: RootStateOrAny) => state.form.imagesPreview);
  const dispatch = useDispatch();

  useEffect(() => (): any => dispatch(clearImagesPreview()), []);

  return (
    <>
      {
        imagesPreview.map((image: string) => (
          <img src={image} alt="preview" className="img-preview" key={image} />
        ))
      }
    </>
  );
};

export default ImagePreview;
