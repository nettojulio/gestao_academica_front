// Importação do modal
import style from "./table.module.scss";
import React, { useState } from 'react';

import ConfirmationPromocaoModal from "../ExcluirPromocao";
import { deleteBarber } from "@/api/barbeiro/deleteBarber";
import { Barbeiro } from "@/interfaces/barbeiroInterface";
import { Agendamento } from "@/interfaces/agendamentoInterface";

interface TableProps {
  table1: string;
  table2: string;
  table3: string;
  listAgendamentos: Agendamento[];
  setAgendamentos: (agendamentos: Agendamento[]) => void; 
  onSelectAgendamento: (agendamentos: Agendamento) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
const Table: React.FC<TableProps> = ({ 
  listAgendamentos,  
  onSelectAgendamento, 
  table1, 
  table2, 
  table3, 
  currentPage, 
  totalPages, 
  setCurrentPage 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [selectedAgendamentoId, setSelectedAgendamentoId] = useState<string | null>(null);
  const [Agendamento, setAgendamento] = useState<Agendamento[]>([]);


  const handleClose = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleOpenModal = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    setIsModalOpen(true);
  };



  const openDeleteModal = (id: string) => {
    setSelectedAgendamentoId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedAgendamentoId(null);
    handleClose();
  };

//  const handleConfirmDelete = async () => {
 //   if (selectedAgendamentoId) {
//      try {
//        await deleteBarber(selectedAgendamentoId);  // Adicione a lógica de exclusão
 //       // Atualize a lista de promoções usando setPromocoes
//       setAgendamento(listAgendamentos.filter(agendamento => agendamento.id !== selectedAgendamentoId));
///      } catch (error) {
 //       console.error('Erro ao excluir a promoção:', error);
 //     }
//     closeDeleteModal();
//   }
//  };
  

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
            {listAgendamentos.map((agendamento, index) => (
              <tr key={index}>
                <td>{agendamento.barber.name}</td>
                <td>{agendamento.clientName}</td>
                <td>
                  <button 
                    onClick={() => onSelectAgendamento(agendamento)} 
                    className={style.content__table__body_click}
                  >
                    <img 
                      src="/assets/icons/visualizar.svg" 
                      alt="Visualizar" 
                    />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(agendamento.clientName)} 
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

      
    </>
  );
};

export default Table;
