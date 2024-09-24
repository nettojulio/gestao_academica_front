// Importação do modal
import style from "./table.module.scss";
import React, { useState } from 'react';

import ConfirmationPromocaoModal from "../ExcluirPromocao";
import { deleteBarber } from "@/api/barbeiro/deleteBarber";
import { Barbeiro } from "@/interfaces/barbeiroInterface";

interface TableProps {
  table1: string;
  table2: string;
  table3: string;
  listBarbeiros: Barbeiro[];
  setBarbeiros: (barbeiros: Barbeiro[]) => void; 
  onSelectBarbeiro: (barbeiro: Barbeiro) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const Table: React.FC<TableProps> = ({ 
  listBarbeiros,  
  onSelectBarbeiro, 
  table1, 
  table2, 
  table3, 
  currentPage, 
  totalPages, 
  setCurrentPage 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<Barbeiro | null>(null);
  const [selectedBarbeiroId, setSelectedBarbeiroId] = useState<string | null>(null);
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);


  const handleClose = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleOpenModal = (barbeiro: Barbeiro) => {
    setSelectedBarbeiro(barbeiro);
    setIsModalOpen(true);
  };



  const openDeleteModal = (id: string) => {
    setSelectedBarbeiroId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedBarbeiroId(null);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    if (selectedBarbeiroId) {
      try {
        await deleteBarber(selectedBarbeiroId);  // Adicione a lógica de exclusão
        // Atualize a lista de promoções usando setPromocoes
        setBarbeiros(listBarbeiros.filter(barbeiro => barbeiro.idBarber !== selectedBarbeiroId));
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
            {listBarbeiros.map((barbeiro, index) => (
              <tr key={index}>
                <td>{barbeiro.name}</td>
                <td>{barbeiro.email}</td>
                <td>
                  <button 
                    onClick={() => onSelectBarbeiro(barbeiro)} 
                    className={style.content__table__body_click}
                  >
                    <img 
                      src="/assets/icons/visualizar.svg" 
                      alt="Visualizar" 
                    />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(barbeiro.idBarber)} 
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

      {selectedBarbeiroId && (
        <ConfirmationPromocaoModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          promocaoId={selectedBarbeiroId}  // Para a exclusão
        />
      )}
    </>
  );
};

export default Table;
