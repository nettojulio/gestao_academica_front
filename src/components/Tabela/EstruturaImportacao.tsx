import React, { useState, useEffect, useRef } from 'react';
import Pagination from './Itens/Paginacao';

interface TabelaProps {
  dados: any;
  estrutura: any;
  chamarFuncao: (chave: string, valor: any) => void;
}

const Tabela: React.FC<TabelaProps> = ({ dados = null, estrutura = null, chamarFuncao = null }: any) => {
  const [dropdownAberto, setDropdownAberto] = useState<{ [key: string]: boolean }>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [bodyParams, setBodyParams] = useState<any>({
    size: 25,
  });

  const paramsColuna = (chave: string | null, valor: string | null) => {
    if (chave != null && valor != null) {
      const updatedBodyParams = {
        ...bodyParams,
        [chave]: valor,
      };
      setBodyParams(updatedBodyParams);
      chamarFuncao('pesquisar', updatedBodyParams);
    }
  };

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

  const verificaTexto = (texto: string | null, tamanhoLimite: number | null) => {
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
    if (texto != null && iso8601Regex.test(texto)) {
      const dataString = texto;
      const data = dataString.split('T')[0];
      const hora = dataString.split('T')[1].split('.')[0];

      const dia = data.split('-')[2];
      const mes = data.split('-')[1];
      const ano = data.split('-')[0];
      return { texto: `${dia}/${mes}/${ano} ${hora}`, truncado: false };
    } else if (texto != null && tamanhoLimite != null && texto.length > tamanhoLimite) {
      return { texto: `${texto.substring(0, tamanhoLimite)}...`, truncado: true, originalTexto: texto };
    } else {
      return { texto, truncado: false };
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', dropdownCliqueiFora);
    return () => {
      document.removeEventListener('mousedown', dropdownCliqueiFora);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col">
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
        <div className="overflow-x-auto">
          <div className="p-1 min-w-full inline-block align-middle">
            <div className="border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                {/* titulo das colunas */}
                <thead className="bg-gray-50" hidden={estrutura?.tabela?.configuracoes?.cabecalho === false}>
                  <tr>
                    {estrutura != null
                      ? estrutura.tabela.colunas.map((item: any, index: number) => (
                          <td
                            key={`menu_${index}`}
                            className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-8000 uppercase text-gray-600"
                          >
                            {item.nome}
                            <button
                              key={index}
                              className="ml-2"
                              onClick={() =>
                                paramsColuna(
                                  'sort',
                                  bodyParams.sort != null && bodyParams.sort.split(',')[1] === 'asc'
                                    ? `${item.chave},desc`
                                    : `${item.chave},asc`
                                )
                              }
                              hidden={!item.sort}
                            >
                              {bodyParams.sort != null &&
                              bodyParams.sort.split(',')[0] === item.chave &&
                              bodyParams.sort.split(',')[1] === 'asc'
                                ? '▲'
                                : '▼'}
                            </button>
                          </td>
                        ))
                      : ''}
                  </tr>
                </thead>
                {/* pesquisar nas colunas */}
                <thead className="bg-gray-50" hidden={estrutura?.tabela?.configuracoes?.pesquisar === false}>
                  <tr>
                    {estrutura != null
                      ? estrutura.tabela.colunas.map((item: any, index: number) => (
                          <td key={`pesquisa_${index}`} className="px-6 py-1">
                            {(item.tipo === 'texto' || item.tipo === 'json') &&
                              !(item.selectOptions && item.selectOptions.length > 0) && (
                                <input
                                  type="text"
                                  id={`pesquisar_coluna_${index}`}
                                  className="pl-1 w-full border rounded text-sm"
                                  placeholder="Pesquisar"
                                  hidden={!item.pesquisar}
                                  onChange={(e) => paramsColuna(item.chave, e.target.value)}
                                />
                              )}
                            {item.tipo === 'booleano' && (
                              <select
                                id={`pesquisar_coluna_${index}`}
                                className="pl-1 w-full border rounded text-sm bg-white"
                                hidden={!item.pesquisar}
                                onChange={(e) => paramsColuna(item.chave, e.target.value)}
                              >
                                <option value="">Selecionar</option>
                                {item.selectOptions.map((option: any) => (
                                  <option key={option.chave} value={option.chave}>
                                    {option.valor}
                                  </option>
                                ))}
                              </select>
                            )}
                            {item.tipo === 'texto' && item.selectOptions && item.selectOptions.length > 0 && (
                              <select
                                id={`pesquisar_coluna_${index}`}
                                className="pl-1 w-full border rounded text-sm bg-white"
                                hidden={!item.pesquisar}
                                onChange={(e) => paramsColuna(item.chave, e.target.value)}
                              >
                                <option value="">Selecionar</option>
                                {item.selectOptions.map((option: any) => (
                                  <option key={option.chave} value={option.chave}>
                                    {option.valor}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                        ))
                      : ''}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dados.content.length > 0 ? (
                    dados.content.map((item: any) => (
                      <tr key={item.id} className="hover:bg-gray-100 ">
                        {estrutura.tabela.colunas.map(({ chave, tipo, selectOptions, tamanhoLimite }: any) => {
                          if (chave === 'acoes') {
                            return (
                              <td key="acoes" className="px-6 py-2 whitespace-nowrap relative">
                                <button
                                  onClick={() => dropdownAbrirFechar(item.id)}
                                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                  <p className="text-lg font-medium text-gray-900 dark:text-gray">...</p>
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
                                    {estrutura != null &&
                                      estrutura.tabela.acoes_dropdown.map((acao: any, index_acao: number) => (
                                        <button
                                          key={index_acao}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                          role="menuitem"
                                          onClick={() => chamarFuncao(acao.chave, item)}
                                        >
                                          {acao.nome}
                                        </button>
                                      ))}
                                  </div>
                                )}
                              </td>
                            );
                          } else if (item[chave] !== undefined && tipo === 'status') {
                            const selectOption = selectOptions.find((option: any) => option.chave === item[chave]);
                            if (selectOption) {
                              let element;
                              switch (selectOption.valor) {
                                case 'Finalizado':
                                  element = (
                                    <td
                                      key={chave}
                                      className="px-6 py-2 whitespace-nowrap flex justify-center items-center"
                                    >
                                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 justify-center items-center">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                                  break;
                                case 'Erro':
                                  element = (
                                    <td
                                      key={chave}
                                      className="px-6 py-2 whitespace-nowrap flex justify-center items-center"
                                    >
                                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800 justify-center items-center">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                                  break;
                                default:
                                  element = (
                                    <td
                                      key={chave}
                                      className="px-6 py-2 whitespace-nowrap flex justify-center items-center"
                                    >
                                      <span className="px-3 inline-flex text-sm leading-6 font-semibold rounded-full bg-gray-100 text-gray-800 justify-center items-center">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                              }
                              return element;
                            }
                          } else if (item[chave] !== undefined && (tipo === 'booleano' || selectOptions)) {
                            const selectOption = selectOptions.find((option: any) => option.chave === item[chave]);
                            if (selectOption) {
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                  {selectOption.valor}
                                </td>
                              );
                            } else {
                              return null;
                            }
                          } else if (tipo === 'json') {
                            const partes = chave.split('|');
                            const key = partes[0];
                            const jsonKey = partes[1];
                            const jsonItem = JSON.parse(item[key]);
                            return (
                              jsonItem &&
                              <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                { verificaTexto(jsonItem[jsonKey], tamanhoLimite).texto}
                              </td>
                            );
                          } else if (item[chave] !== undefined) {
                            const { texto, truncado, originalTexto } = verificaTexto(item[chave], tamanhoLimite);
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
                          } else if (item[chave] === undefined) {
                            const keys = chave.split('.');
                            let nestedValue = item;
                            for (let key of keys) {
                              if (nestedValue) {
                                nestedValue = nestedValue[key];
                                if (nestedValue === undefined) break;
                              }
                            }
                            return (
                              <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                {verificaTexto(nestedValue, tamanhoLimite).texto}
                              </td>
                            );
                          }
                          return null;
                        })}
                        {/* Tooltip */}
                        <div className="absolute hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2">
                          {item['mensagemRetorno']}
                          <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={estrutura.tabela.colunas.length} className="text-center py-4">
                        <h6 className="text-gray-600">Nenhum registro encontrado.</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {estrutura?.tabela?.configuracoes?.rodape && (
        <Pagination dados={dados} paramsColuna={paramsColuna} />
      )}
    </div>
  );
};

export default Tabela;
