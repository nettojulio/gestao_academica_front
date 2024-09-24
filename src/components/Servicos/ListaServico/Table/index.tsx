"use client";

import { useState } from "react";
import style from "./table.module.scss";
import { deleteServico } from "@/api/servicos/deleteServico";
import ConfirmationModal from "../ExcluirServico";
import { Servico } from "@/interfaces/servicoInterface";

interface TableProps {
  table1: string;
  table2: string;
  table3: string;
  table4: string;
  table5: string;
  listServicos: Servico[];
  setServicos: (servicos: Servico[]) => void;
  onSelectServico: (servico: Servico) => void;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}



const Table: React.FC<TableProps> = ({
  listServicos,
  setServicos,
  onSelectServico,
  table1,
  table2,
  table3,
  table4,
  table5,
  currentPage,
  totalPages,
  setCurrentPage
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServicoId, setSelectedServicoId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setSelectedServicoId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedServicoId(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedServicoId) {
      await deleteServico(selectedServicoId);
      setServicos(listServicos.filter(servico => servico.id !== selectedServicoId));
      closeModal();
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
              <th>{table3}</th>
              <th>{table4}</th>
              <th className={style.content__table__header_name3}>
                <div>
                  {table5}
                  <img src="/assets/icons/informacao.svg" alt="Visualizar" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className={style.content__table__body}>
            {listServicos.map((servico, index) => (
              <tr key={index}>
                <td>{servico.name}</td>
                <td>{servico.value}</td>
                <td>{servico.description}</td>
                <td>{servico.time} min</td>
                <td>
                  <img 
                    src="/assets/icons/visualizar.svg" 
                    alt="Visualizar" 
                    onClick={() => onSelectServico(servico)} 
                    className={style.content__table__body_click} 
                  />
                  <img 
                    src="/assets/icons/excluir.svg" 
                    alt="Excluir" 
                    onClick={() => openModal(servico.id)} 
                    className={style.content__table__body_click} 
                  />
                </td>
              </tr>
            ))}
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
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        message="Tem certeza que deseja excluir este serviço?"
      />
    </>
  );
};

export default Table;
