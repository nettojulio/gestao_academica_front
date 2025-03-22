import React, { useState, useEffect, useRef } from 'react';
import PaginacaoCliente from './PaginacaoCliente';

interface TabelaClienteProps {
  dados: any;
  estrutura: any;
  chamarFuncao: (chave: string, valor: any) => void;
}

const TabelaCliente: React.FC<TabelaClienteProps> = ({
  dados = null,
  estrutura = null,
  chamarFuncao = null,
}: any) => {
  const [dropdownAberto, setDropdownAberto] = useState<{ [key: string]: boolean }>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Estados para paginação e dados filtrados
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Ajuste conforme necessário
  const [filteredData, setFilteredData] = useState(dados?.content || []);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortConfig, setSortConfig] = useState<{ chave: string; direction: string } | null>(null);

  const dropdownAbrirFechar = (id: string) => {
    setDropdownAberto((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const dropdownCliqueiFora = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownAberto({});
    }
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
  };

  const compareValues = (a: any, b: any, direction: string) => {
    if (a == null) return direction === 'asc' ? -1 : 1;
    if (b == null) return direction === 'asc' ? 1 : -1;

    if (typeof a === 'number' && typeof b === 'number') {
      return direction === 'asc' ? Number(a) - Number(b) : Number(b) - Number(a);
    }

    if (a instanceof Date && b instanceof Date) {
      return direction === 'asc' ? Number(a) - Number(b) : Number(b) - Number(a);
    }

    return direction === 'asc'
      ? a.toString().localeCompare(b.toString())
      : b.toString().localeCompare(a.toString());
  };

  const verificaTexto = (texto: string | null, tamanhoLimite: number | null) => {
    const iso8601Regex =
      /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})(\.\d+)?([+-]\d{2}:\d{2}|Z)?$/;
    if (texto != null && iso8601Regex.test(texto)) {
      const dataObj = new Date(texto);
      const dia = dataObj.getDate().toString().padStart(2, '0');
      const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
      const ano = dataObj.getFullYear();
      const hora = dataObj.getHours().toString().padStart(2, '0');
      const minutos = dataObj.getMinutes().toString().padStart(2, '0');
      return { texto: `${dia}/${mes}/${ano} ${hora}:${minutos}`, truncado: false };
    } else if (texto != null && tamanhoLimite != null && texto.length > tamanhoLimite) {
      return { texto: `${texto.substring(0, tamanhoLimite)}...`, truncado: true, originalTexto: texto };
    } else {
      return { texto, truncado: false };
    }
  };

  // Função para filtrar os dados
  const filtrarDados = () => {
    let filtered = dados.content || [];

    // Aplicar filtros
    Object.keys(filters).forEach((key) => {
      const valorFiltro = filters[key].toLowerCase();
      filtered = filtered.filter((item) => {
        const valorItem = getNestedValue(item, key)?.toString().toLowerCase() || '';
        return valorItem.includes(valorFiltro);
      });
    });

    // Aplicar ordenação
    if (sortConfig !== null) {
      filtered = filtered.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.chave);
        const bValue = getNestedValue(b, sortConfig.chave);

        return compareValues(aValue, bValue, sortConfig.direction);
      });
    }

    setFilteredData(filtered);
    setCurrentPage(0); // Resetar para a primeira página
  };

  useEffect(() => {
    document.addEventListener('mousedown', dropdownCliqueiFora);
    return () => {
      document.removeEventListener('mousedown', dropdownCliqueiFora);
    };
  }, []);

  useEffect(() => {
    if (dados && dados.content) {
      filtrarDados();
    }
  }, [filters, sortConfig, dados]);

  const handleSearch = (chave: string, valor: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [chave]: valor,
    }));
  };

  const handleSort = (chave: string) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.chave === chave && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ chave, direction });
  };

  // Calculando os índices para fatiar os dados
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="flex flex-col">
        {/* Botões */}
        <div className="flex justify-end overflow-x-auto mt-2.5">
          {estrutura != null
            ? estrutura.tabela.botoes.map((botao: any, index: number) => (
                <button
                  key={index}
                  className="ml-2 mb-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 border rounded"
                  disabled={botao.bloqueado}
                  hidden={botao.oculto}
                  onClick={() => chamarFuncao(botao.chave, botao)}
                >
                  {botao.nome}
                </button>
              ))
            : ''}
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <div className="p-1 min-w-full inline-block align-middle">
            <div className="border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Cabeçalho da tabela */}
                <thead
                  className="bg-gray-50"
                  hidden={estrutura?.tabela?.configuracoes?.cabecalho === false}
                >
                  <tr>
                    {estrutura?.tabela.colunas.map((item: any, index: number) => (
                      <th
                        key={`menu_${index}`}
                        className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800 uppercase text-gray-600"
                      >
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSort(item.chave)}
                        >
                          {item.nome}
                          {sortConfig && sortConfig.chave === item.chave ? (
                            sortConfig.direction === 'asc' ? (
                              <span className="ml-1">▲</span>
                            ) : (
                              <span className="ml-1">▼</span>
                            )
                          ) : (
                            <span className="ml-1">⇅</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Pesquisa nas colunas */}
                <thead
                  className="bg-gray-50"
                  hidden={estrutura?.tabela?.configuracoes?.pesquisar === false}
                >
                  <tr>
                    {estrutura?.tabela.colunas.map((item: any, index: number) => (
                      <td key={`pesquisa_${index}`} className="px-6 py-1">
                        {item.pesquisar && (
                          <>
                            {(item.tipo === 'texto' || item.tipo === 'json') &&
                              !item.selectOptions && (
                                <input
                                  type="text"
                                  className="pl-1 w-full border rounded text-sm"
                                  placeholder="Pesquisar"
                                  onChange={(e) => handleSearch(item.chave, e.target.value)}
                                />
                              )}
                            {(item.tipo === 'booleano' || item.selectOptions) && (
                              <select
                                className="pl-1 w-full border rounded text-sm bg-white"
                                onChange={(e) => handleSearch(item.chave, e.target.value)}
                              >
                                <option value="">Selecionar</option>
                                {item.selectOptions.map((option: any) => (
                                  <option key={option.chave} value={option.chave}>
                                    {option.valor}
                                  </option>
                                ))}
                              </select>
                            )}
                          </>
                        )}
                      </td>
                    ))}
                  </tr>
                </thead>

                {/* Corpo da tabela */}
                <tbody className="divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-100">
                        {estrutura.tabela.colunas.map(
                          ({ chave, tipo, selectOptions, tamanhoLimite }: any) => {
                            const valorCelula = getNestedValue(item, chave);

                            if (chave === 'acoes') {
                              // Código para o dropdown de ações
                              return (
                                <td key="acoes" className="px-6 py-2 whitespace-nowrap relative">
                                  <button
                                    onClick={() => dropdownAbrirFechar(item.id)}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                  >
                                    <p className="text-lg font-medium text-gray-900 dark:text-gray">
                                      ...
                                    </p>
                                  </button>
                                  {dropdownAberto[item.id] && (
                                    <div
                                      ref={dropdownRef}
                                      className="absolute z-10 mt-2 w-30 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 left-0"
                                      style={{ marginLeft: '-70px', marginTop: '-90px' }}
                                      role="menu"
                                      aria-orientation="vertical"
                                      aria-labelledby="options-menu"
                                    >
                                      {estrutura?.tabela.acoes_dropdown.map(
                                        (acao: any, index_acao: number) => (
                                          <button
                                            key={index_acao}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                            role="menuitem"
                                            onClick={() => chamarFuncao(acao.chave, item)}
                                          >
                                            {acao.nome}
                                          </button>
                                        )
                                      )}
                                    </div>
                                  )}
                                </td>
                              );
                            } else if (tipo === 'status' && selectOptions) {
                              // Código para exibir status com cores
                              const selectOption = selectOptions.find(
                                (option: any) => option.chave === valorCelula
                              );
                              if (selectOption) {
                                let bgColor = 'bg-gray-100';
                                let textColor = 'text-gray-800';

                                switch (selectOption.valor) {
                                  case 'Finalizado':
                                    bgColor = 'bg-green-100';
                                    textColor = 'text-green-800';
                                    break;
                                  case 'Erro':
                                    bgColor = 'bg-red-100';
                                    textColor = 'text-red-800';
                                    break;
                                  default:
                                    break;
                                }

                                return (
                                  <td
                                    key={chave}
                                    className="px-6 py-2 whitespace-nowrap flex items-center"
                                  >
                                    <span
                                      className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${bgColor} ${textColor} justify-center items-center`}
                                    >
                                      {selectOption.valor}
                                    </span>
                                  </td>
                                );
                              }
                            } else if (tipo === 'booleano' || selectOptions) {
                              const selectOption = selectOptions.find(
                                (option: any) => option.chave === valorCelula
                              );
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                  {selectOption ? selectOption.valor : ''}
                                </td>
                              );
                            } else if (tipo === 'json') {
                              const [key, jsonKey] = chave.split('|');
                              const jsonItem = JSON.parse(item[key]);
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                  {verificaTexto(jsonItem[jsonKey], tamanhoLimite).texto}
                                </td>
                              );
                            } else if (valorCelula !== undefined) {
                              const { texto, truncado, originalTexto } = verificaTexto(
                                valorCelula,
                                tamanhoLimite
                              );
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap relative group">
                                  {truncado ? (
                                    <>
                                      <span>{texto}</span>
                                      <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2">
                                        {originalTexto}
                                        <div className="tooltip-arrow" data-popper-arrow></div>
                                      </div>
                                    </>
                                  ) : (
                                    texto
                                  )}
                                </td>
                              );
                            } else {
                              // Tratamento para chaves aninhadas
                              const nestedKeys = chave.split('.');
                              let nestedValue = item;
                              for (const k of nestedKeys) {
                                nestedValue = nestedValue ? nestedValue[k] : undefined;
                              }
                              const { texto } = verificaTexto(nestedValue, tamanhoLimite);
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                  {texto}
                                </td>
                              );
                            }
                            return null;
                          }
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={estrutura.tabela.colunas.length}
                        className="text-center py-4"
                      >
                        <h6 className="text-gray-600">Nenhum registro encontrado.</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Paginação */}
        {estrutura?.tabela?.configuracoes?.rodape && (
          <PaginacaoCliente
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default TabelaCliente;
