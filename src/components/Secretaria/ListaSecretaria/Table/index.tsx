// Importação do modal
import style from "./table.module.scss";
import React, { useState } from 'react';

import ConfirmationPromocaoModal from "../ExcluirPromocao";
import { deleteBarber } from "@/api/barbeiro/deleteBarber";
import { Secretaria } from "@/interfaces/secretariaInterface";

interface TableProps {
  table1: string;
  table2: string;
  table3: string;
  listSecretarias: Secretaria[];
  setSecretaria: (secretaria: Secretaria[]) => void; 
  onSelectSecretaria: (secretaria: Secretaria) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const Table: React.FC<TableProps> = ({ 
  listSecretarias: listSecretarias,  
  onSelectSecretaria: onSelectSecretaria, 
  table1, 
  table2, 
  table3, 
  currentPage, 
  totalPages, 
  setCurrentPage 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSecretaria, setSelectedSecretaria] = useState<Secretaria | null>(null);
  const [selectedSecretariaId, setSelectedSecretariaId] = useState<string | null>(null);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);


  const handleClose = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleOpenModal = (secretaria: Secretaria) => {
    setSelectedSecretaria(secretaria);
    setIsModalOpen(true);
  };



  const openDeleteModal = (id: string) => {
    setSelectedSecretariaId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedSecretariaId(null);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    if (selectedSecretariaId) {
      try {
        await deleteBarber(selectedSecretariaId);  // Adicione a lógica de exclusão
        // Atualize a lista de promoções usando setPromocoes
        setSecretarias(listSecretarias.filter(secretaria => secretaria.idSecretary !== selectedSecretariaId));
      } catch (error) {
        console.error('Erro ao excluir a promoção:', error);
      }
      closeDeleteModal();
    }
  };
  

  return (
    <>
      <div className={style.content}>
        <table className={style.content__table}>
          <thead className={style.content__table__header}>
            <tr>
              <th>{table1}</th>
              <th>{table2}</th>
              <th className={style.content__table__header_name3}>
                <div>
                  {table3}
                  <img src="/assets/icons/informacao.svg" alt="Visualizar" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className={style.content__table__body}>
            {listSecretarias.map((secretaria, index) => (
              <tr key={index}>
                <td>{secretaria.name}</td>
                <td>{secretaria.contact}</td>
                <td>
                  <button 
                    onClick={() => onSelectSecretaria(secretaria)} 
                    className={style.content__table__body_click}
                  >
                    <img 
                      src="/assets/icons/visualizar.svg" 
                      alt="Visualizar" 
                    />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(secretaria.idSecretary)} 
                    className={style.content__table__body_click}
                  >
                    <img 
                      src="/assets/icons/excluir.svg" 
                      alt="Excluir" 
                    />
                  </button>
                </td>
              </tr>
            ))}
            {/* Pagination Controls */}
          </tbody>
        </table>
        <div className={style.content__table__pagination}>
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>
            Next
          </button>
        </div>
      </div>

      {selectedSecretariaId && (
        <ConfirmationPromocaoModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          promocaoId={selectedSecretariaId}  // Para a exclusão
        />
      )}
    </>
  );
};

export default Table;
