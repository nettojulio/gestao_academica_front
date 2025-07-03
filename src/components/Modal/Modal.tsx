import React, { ReactNode } from "react";
import {
    XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import styles from "./Modal.module.css";

const levelConfig = {
  success: { Icon: CheckCircleIcon, className: styles.success },
  error: { Icon: XCircleIcon, className: styles.error },
  warning: { Icon: ExclamationTriangleIcon, className: styles.warning },
  info: { Icon: InformationCircleIcon, className: styles.info },
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: ReactNode;
  level?: "success" | "error" | "warning" | "info";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = "Aviso Importante!",
  content,
  level = "warning",
}) => {
  if (!isOpen) {
    return null;
  }
  const { Icon, className } = levelConfig[level];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.backgroundIconContainer}>
          <Icon
            className={`${styles.backgroundIcon} ${className}`}
            aria-hidden="true"
          />
        </div>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Fechar modal"
        >
          <XMarkIcon className={styles.icon} />
        </button>

        <div>
          <h2 className={styles.modalTitle}>{title}</h2>
          <div className={styles.modalContent}>{content}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
