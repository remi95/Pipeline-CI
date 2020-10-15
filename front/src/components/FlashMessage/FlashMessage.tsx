import React from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Alert } from 'reactstrap';

const FlashMessage: React.FC = () => {
  const flashMessage = useSelector((state: RootStateOrAny) => state.app.flashMessage);

  return (
    <>
      {
        flashMessage
          ? (
            <Alert color={flashMessage.type} className="my-2">
              {flashMessage.message}
            </Alert>
          )
          : null
      }
    </>
  );
};

export default FlashMessage;
