import React, { useEffect, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import './ModalSurprise.scss';

const ModalSurprise: React.FC = () => {
  const [ctrlKey, setCtrlKey] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [openModal, setOpenModal] = useState(false);

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.keyCode === 17) {
      setCtrlKey(true);
    }
  };
  const handleKeyUp = (e: KeyboardEvent): void => {
    if (e.keyCode === 17) {
      setCtrlKey(false);
      setOpenModal(false);
    }
  };
  const handleMouseMove = (e: any): void => {
    setMousePosition({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (ctrlKey) {
      const { y, x } = mousePosition;
      const screenWidth = window.innerWidth;
      const percent = 5;
      const diff = (screenWidth * percent) / 100;
      if (y <= 50 && x >= (screenWidth - diff)) {
        setOpenModal(true);
      } else {
        setOpenModal(false);
      }
    }
  }, [ctrlKey, mousePosition]);

  return (
    <div className="modal-surprise" onMouseMove={(e): void => handleMouseMove(e)}>
      <Modal isOpen={openModal}>
        <ModalBody>
          <p>Les marmottes forment un genre de mammifère fouisseur de l'ordre des rongeurs.</p>
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Marmota_marmota_Alpes2.jpg" alt="marmotte" />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ModalSurprise;
