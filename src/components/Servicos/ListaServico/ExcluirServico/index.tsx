import React from 'react';
import style from './ConfirmationModal.module.scss';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>; 
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message }) => { 
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();  
    onClose();
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <h1>{message}</h1>
        <p className={style.warningText}>Após a confirmação, não será possível reverter esta operação.</p>
        <div className={style.modalActions}>
          <button className={style.confirmButton} onClick={handleConfirm}>Confirmar</button>
          <button className={style.cancelButton} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
