"use client"
import React, { useEffect, useRef, useState } from 'react';
import Pagination from './Itens/Paginacao';

const TabelaArvore = ({ dados = null, estrutura = null, chamarFuncao = null }: any) => {
  // Estados utilizados no componente:
  const [dropdownAberto, setDropdownAberto] = useState<any>({});
  const dropdownRef = useRef<any>(null);
  const [bodyParams, setBodyParams] = useState<any>({ size: 25 });
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({});

  // Hook para detectar a largura da tela (desktop vs. mobile)
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Converte a lista plana de dados em estrutura de árvore usando o campo "unidadePaiId"
  useEffect(() => {
    if (!dados || !Array.isArray(dados)) {
        //console.error('dados não é um array:', dados);
        return;
      }    const dataMap = new Map<number, any>();
    // Cria o mapa e inicializa a propriedade children em cada item
    dados.forEach((item: any) => {
      dataMap.set(item.id, { ...item, children: [] });
    });
    const tree: any[] = [];
    dataMap.forEach((item: any) => {
      if (item.unidadePaiId === null || !dataMap.has(item.unidadePaiId)) {
        tree.push(item);
      } else {
        const parent = dataMap.get(item.unidadePaiId);
        parent.children.push(item);
      }
    });
    setTreeData(tree);
  }, [dados]);

  // Função para atualizar filtros (mantém a mesma lógica do componente Tabela)
  const paramsColuna = (chave: any = null, valor: any = null) => {
    if (chave != null && valor != null) {
      const updatedBodyParams = { ...bodyParams, [chave]: valor };
      setBodyParams(updatedBodyParams);
      chamarFuncao && chamarFuncao('pesquisar', updatedBodyParams);
    }
  };

  // Função para controle de dropdown de ações (mesma lógica do Tabela)
  const dropdownAbrirFechar = (id: any) => {
    setDropdownAberto((prevState: any) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const dropdownCliqueiFora = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownAberto({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', dropdownCliqueiFora);
    return () => {
      document.removeEventListener('mousedown', dropdownCliqueiFora);
    };
  }, []);

  // Função para verificar se o texto segue padrão ISO8601 e formatá-lo
  const verificaTexto = (texto: any) => {
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
    if (texto != null && iso8601Regex.test(texto)) {
      let dataString = texto;
      let data = dataString.split("T")[0];
      let hora = dataString.split("T")[1].split(".")[0];
      let dia = data.split('-')[2];
      let mes = data.split('-')[1];
      let ano = data.split('-')[0];
      return `${dia}/${mes}/${ano} ${hora}`;
    } else {
      return texto;
    }
  };

  // Renderização dos filtros (usando a mesma lógica do Tabela)
  const renderFiltros = () => {
    if (!estrutura?.tabela?.colunas) return null;
    const filters = estrutura.tabela.colunas.filter((col: any) => col.pesquisar);
    return (
      <div className="flex flex-wrap gap-4 w-full">
        {filters.map((item: any, index: any) => (
          <div key={`filtro_${index}`} className="w-full sm:w-auto flex-1 min-w-[200px] flex flex-col">
            <label htmlFor={`filtro_${index}`} className="mb-1 text-sm font-bold text-neutrals-900">
              {item.nome}
            </label>
            {(item.tipo === 'texto' || item.tipo === 'json') &&
              !(item.selectOptions && item.selectOptions.length > 0) && (
                <input
                  type="text"
                  id={`filtro_${index}`}
                  className="pl-2 py-1 border rounded-md text-sm"
                  placeholder="Pesquisar"
                  onChange={(e) => paramsColuna(item.chave, e.target.value)}
                />
              )}
            {(item.tipo === 'booleano' ||
              (item.tipo === 'texto' && item.selectOptions && item.selectOptions.length > 0)) && (
              <select
                id={`filtro_${index}`}
                className="pl-2 py-1 border rounded-md text-sm bg-white"
                onChange={(e) => paramsColuna(item.chave, e.target.value)}
              >
                {!item.selectOptions?.some((option: any) => option.valor === "Todos") && (
                  <option value="">Selecionar</option>
                )}
                {item.selectOptions.map((option: { chave: any; valor: any }) => (
                  <option key={option.chave} value={option.chave}>
                    {option.valor}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Função auxiliar para renderizar o conteúdo da célula usando a mesma lógica do Tabela
  const renderCellContent = (node: any, col: any) => {
    // Tratamento para coluna do tipo json (chave com separador '|' para identificar a chave do JSON)
    if (col.tipo === 'json') {
      const partes = col.chave.split('|');
      let key = partes[0];
      let jsonKey = partes[1];
      try {
        let jsonItem = JSON.parse(node[key]);
        if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
          return verificaTexto(jsonItem[jsonKey]);
        }
        return '';
      } catch (e) {
        return '';
      }
    } else if (node[col.chave] !== undefined) {
      // Coluna do tipo status com selectOptions
      if (col.tipo === "status" && col.selectOptions) {
        const selectOption = col.selectOptions.find((option: any) => option.chave === node[col.chave]);
        if (selectOption) {
          switch (selectOption.valor) {
            case 'Finalizado':
              return (
                <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-green-100 text-green-800">
                  {selectOption.valor}
                </span>
              );
            case 'Erro':
              return (
                <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-red-100 text-red-800">
                  {selectOption.valor}
                </span>
              );
            default:
              return (
                <span className="px-3 inline-flex text-sm leading-6 font-normal rounded-full bg-neutrals-100 text-neutrals-800">
                  {selectOption.valor}
                </span>
              );
          }
        } else {
          return '';
        }
      }
      // Colunas booleanas ou com selectOptions para exibir valor formatado
      else if (col.tipo === "booleano" || col.selectOptions) {
        const selectOption =
          col.selectOptions && col.selectOptions.find((option: any) => option.chave === node[col.chave]);
        if (selectOption) {
          return (
            <div
              className={`py-2 text-center rounded-md text-label-medium font-normal ${
                selectOption.chave === true || selectOption.chave === "APROVADA"
                  ? "bg-success-100 text-success-900"
                  : selectOption.chave === "PENDENTE"
                  ? "bg-warning-100 text-warning-900"
                  : "bg-danger-100 text-danger-900"
              }`}
            >
              {selectOption.valor}
            </div>
          );
        }
        return '';
      }
      // Se o valor for primitivo, apenas verifica se é data/texto
      else if (typeof node[col.chave] !== 'object') {
        return verificaTexto(node[col.chave]);
      } else {
        return '';
      }
    } else {
      // Se o campo não for encontrado diretamente, tenta encontrar valores aninhados (ex.: "tipoUnidadeAdministrativa.nome")
      if (col.chave.indexOf('.') !== -1) {
        const keys = col.chave.split('.');
        let nestedValue = node;
        for (let k of keys) {
          if (nestedValue) {
            nestedValue = nestedValue[k];
          }
        }
        if (nestedValue !== undefined && typeof nestedValue !== 'object') {
          return verificaTexto(nestedValue);
        }
      }
      return '';
    }
  };

  // Função recursiva para renderizar cada linha (nó) da árvore para a versão desktop
  // Consideramos que a primeira coluna (index === 0) receberá a indentação e o botão de expandir/recolher.
  const renderRow = (node: any, level: number = 0) => {
    return (
      <React.Fragment key={node.id}>
        <tr className="hover:bg-neutrals-100">
          {estrutura.tabela.colunas.map((col: any, index: number) => {
            // Para a primeira coluna, adiciona indentação e o botão de expandir/recolher se houver filhos
            if (index === 0) {
              return (
                <td key={col.chave} className="px-6 py-2 whitespace-nowrap font-normal">
                  <div className="flex items-center" style={{ paddingLeft: `${level * 20}px` }}>
                    {node.children && node.children.length > 0 && (
                      <button onClick={() => toggleNode(node.id)} className="mr-2 focus:outline-none">
                        {expandedNodes[node.id] ? '▼' : '▶'}
                      </button>
                    )}
                    <span>{renderCellContent(node, col)}</span>
                  </div>
                </td>
              );
            }
            // Coluna de ações com dropdown (seguindo a lógica original)
            else if (col.chave === 'acoes') {
              return (
                <td
                  key={col.chave}
                  className="px-6 py-2 whitespace-nowrap relative border-l border-neutrals-200 flex items-center justify-center"
                >
                  <button
                    onClick={() => dropdownAbrirFechar(node.id)}
                    className="flex justify-center items-center text-neutrals-500 hover:text-neutrals-700 focus:outline-none"
                  >
                    <p className="text-lg font-bold text-neutrals-900">...</p>
                  </button>
                  {dropdownAberto[node.id] && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 mt-2 w-30 rounded-md shadow-lg bg-neutrals-50 border-2 border-neutrals-200 ring-1 ring-black ring-opacity-5 left-0"
                      style={{ marginLeft: '-55px', marginTop: '-60px' }}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      {estrutura.tabela.acoes_dropdown &&
                        estrutura.tabela.acoes_dropdown.map((acao: any, idx: number) => (
                          <button
                            key={idx}
                            className="block px-4 py-2 text-sm text-neutrals-700 hover:bg-neutrals-100 w-full text-center"
                            role="menuitem"
                            onClick={() => chamarFuncao(acao.chave, node)}
                          >
                            {acao.nome}
                          </button>
                        ))}
                    </div>
                  )}
                </td>
              );
            }
            // Outras colunas, renderizam o conteúdo normalmente
            else {
              return (
                <td key={col.chave} className="px-6 py-2 whitespace-nowrap font-normal">
                  {renderCellContent(node, col)}
                </td>
              );
            }
          })}
        </tr>
        {/* Se o nó tiver filhos e estiver expandido, renderiza-os recursivamente */}
        {node.children &&
          node.children.length > 0 &&
          expandedNodes[node.id] &&
          node.children.map((child: any) => renderRow(child, level + 1))}
      </React.Fragment>
    );
  };

  // Função para alternar a expansão de um nó
  const toggleNode = (id: number) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="flex flex-col">
        {/* Linha de botões */}
        <div className="flex justify-between items-center overflow-x-auto mt-2.5">
          {/* Lado Esquerdo: Botão de Filtrar */}
          <div className="flex items-center">
            {estrutura?.tabela?.configuracoes?.pesquisar && (
              <div className="relative ml-2">
                <button
                  className="mb-2 px-4 py-2 bg-neutrals-100 text-primary-500 text-sm rounded-md border border-primary-500 hover:bg-primary-700 hover:text-white hover:border-primary-700 transition-colors duration-200"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? '▲' : '▼'} Filtrar
                </button>
              </div>
            )}
          </div>
          {/* Lado Direito: Outros botões */}
          <div className="flex items-center">
            {estrutura?.tabela?.botoes &&
              estrutura.tabela.botoes
                .filter((botao: any) => botao.nome !== 'Filtrar')
                .map((botao: any, index: number) => (
                  <button
                    key={index}
                    className="ml-2 mb-2 px-4 py-2 text-sm text-neutrals-50 bg-primary-500 hover:bg-primary-700 border rounded-md"
                    disabled={botao.bloqueado}
                    hidden={botao.oculto}
                    onClick={() => chamarFuncao(botao.chave, botao)}
                  >
                    {botao.nome}
                  </button>
                ))}
          </div>
        </div>
        {showFilters && (
          <div className="mb-4 p-4 bg-neutrals-50 rounded-md shadow">{renderFiltros()}</div>
        )}
        {/* Renderização para Desktop */}
        <div className="overflow-x-auto rounded-md border-2 border-neutrals-200 hidden md:block">
          <div className="min-w-full inline-block align-middle">
            <div className="rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-neutrals-200">
                <thead
                  className="bg-neutrals-50"
                  hidden={estrutura?.tabela?.configuracoes && !estrutura.tabela.configuracoes.cabecalho}
                >
                  <tr>
                    {estrutura.tabela.colunas.map((item: any, index: any) => (
                      <td
                        key={index}
                        className={
                          item.nome.toUpperCase() === "AÇÕES"
                            ? "px-6 py-3 whitespace-nowrap text-sm font-bold uppercase text-neutrals-900 text-center"
                            : "px-6 py-3 whitespace-nowrap text-sm font-bold uppercase text-neutrals-900"
                        }
                        title={item.hint || ""}
                      >
                        <div
                          className={
                            item.nome.toUpperCase() === "AÇÕES"
                              ? "flex items-center justify-center gap-2"
                              : "flex items-center gap-2"
                          }
                        >
                          {item.nome}
                          {item.hint && (
                            <div className="ml-2 relative group">
                              <svg
                                className="w-5 h-5 text-neutrals-800 cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          {item.sort && (
                            <button
                              className="ml-2"
                              onClick={() =>
                                paramsColuna(
                                  "sort",
                                  bodyParams.sort != null &&
                                    bodyParams.sort.split(",")[1] === "asc"
                                    ? `${item.chave},desc`
                                    : `${item.chave},asc`
                                )
                              }
                              hidden={!item.sort}
                            >
                              {bodyParams.sort != null &&
                              bodyParams.sort.split(",")[0] === item.chave &&
                              bodyParams.sort.split(",")[1] === "asc"
                                ? "▲"
                                : "▼"}
                            </button>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutrals-200">
                  {treeData && treeData.length > 0 ? (
                    treeData.map((node: any) => renderRow(node))
                  ) : (
                    <tr>
                      <td colSpan={estrutura.tabela.colunas.length} className="text-center py-4 font-normal">
                        <h6 className="text-neutrals-600">Nenhum registro encontrado.</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Layout Stacked para Mobile */}
        <div className="block md:hidden">
          {treeData && treeData.length > 0 ? (
            treeData.map((node: any) => (
              <div key={node.id} className="bg-white border border-neutrals-200 rounded-md p-4 mb-4 shadow">
                {estrutura.tabela.colunas.map((col: any, index: number) => {
                  if (col.chave === 'acoes') {
                    // No mobile, exibe os botões de ação diretamente
                    return (
                      <div key={col.chave} className="mt-2 flex justify-end gap-2">
                        {estrutura.tabela.acoes_dropdown &&
                          estrutura.tabela.acoes_dropdown.map((acao: any, idx: number) => (
                            <button
                              key={idx}
                              className="px-4 py-2 text-sm text-neutrals-50 bg-primary-500 hover:bg-primary-700 border rounded-md"
                              onClick={() => chamarFuncao(acao.chave, node)}
                            >
                              {acao.nome}
                            </button>
                          ))}
                      </div>
                    );
                  } else {
                    return (
                      <div key={col.chave} className="mb-2">
                        <span className="block text-sm font-bold text-neutrals-900">{col.nome}:</span>
                        <span className="block text-sm text-neutrals-700 font-normal">
                          {col.chave === estrutura.tabela.colunas[0].chave && node.children && node.children.length > 0 ? (
                            <div className="flex items-center">
                              <button onClick={() => toggleNode(node.id)} className="mr-2 focus:outline-none">
                                {expandedNodes[node.id] ? '▼' : '▶'}
                              </button>
                              {renderCellContent(node, col)}
                            </div>
                          ) : (
                            renderCellContent(node, col)
                          )}
                        </span>
                      </div>
                    );
                  }
                })}
                {node.children && node.children.length > 0 && expandedNodes[node.id] && (
                  <div className="mt-4 border-t pt-4">
                    {node.children.map((child: any) => (
                      <div key={child.id} className="ml-4 mt-2">
                        {estrutura.tabela.colunas.map((col: any) =>
                          col.chave === 'acoes' ? (
                            <div key={col.chave} className="mt-2 flex justify-end gap-2">
                              {estrutura.tabela.acoes_dropdown &&
                                estrutura.tabela.acoes_dropdown.map((acao: any, idx: number) => (
                                  <button
                                    key={idx}
                                    className="px-4 py-2 text-sm text-neutrals-50 bg-primary-500 hover:bg-primary-700 border rounded-md"
                                    onClick={() => chamarFuncao(acao.chave, child)}
                                  >
                                    {acao.nome}
                                  </button>
                                ))}
                            </div>
                          ) : (
                            <div key={col.chave} className="mb-2">
                              <span className="block text-sm font-bold text-neutrals-900">{col.nome}:</span>
                              <span className="block text-sm text-neutrals-700 font-normal">
                                {col.chave === estrutura.tabela.colunas[0].chave && child.children && child.children.length > 0 ? (
                                  <div className="flex items-center">
                                    <button onClick={() => toggleNode(child.id)} className="mr-2 focus:outline-none">
                                      {expandedNodes[child.id] ? '▼' : '▶'}
                                    </button>
                                    {renderCellContent(child, col)}
                                  </div>
                                ) : (
                                  renderCellContent(child, col)
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 font-normal">
              <h6 className="text-neutrals-600">Nenhum registro encontrado.</h6>
            </div>
          )}
        </div>
      </div>
      {estrutura?.tabela?.configuracoes?.rodape && (
        <Pagination dados={dados} paramsColuna={paramsColuna} />
      )}
    </div>
  );
};

export default TabelaArvore;
