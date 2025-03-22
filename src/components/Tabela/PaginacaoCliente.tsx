import React from 'react';

interface PaginacaoClienteProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const PaginacaoCliente: React.FC<PaginacaoClienteProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: any) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-1 border rounded-l"
      >
        Anterior
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handleClick(number)}
          className={`px-3 py-1 border-t border-b ${
            currentPage === number ? 'bg-blue-500 text-white' : ''
          }`}
        >
          {number + 1}
        </button>
      ))}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage + 1 === totalPages}
        className="px-3 py-1 border rounded-r"
      >
        Próximo
      </button>
    </div>
  );
};

export default PaginacaoCliente;
