import { useEffect, useRef, useState } from 'react';
import Pagination from '@/components/Tabela/Itens/Paginacao';

const Tabela = ({ dados = null, estrutura = null, chamarFuncao = null }: any) => {
  const [dropdownAberto, setDropdownAberto] = useState<any>({});
  const dropdownRef = useRef<any>(null);
  const [bodyParams, setBodyParams] = useState<any>({ size: 25 });
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [filtroDataAgendamento, setFiltroDataAgendamento] = useState<string>("");
  const [filtroTipoAtendimento, setFiltroTipoAtendimento] = useState<string>("");
  const [filtroDataCancelamento, setFiltroDataCancelamento] = useState<string>("");
  const [filtroNomeAluno, setFiltroNomeAluno] = useState<string>("");

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const paramsColuna = (chave: any = null, valor: any = null) => {
    if (chave === 'dataAgendamento') {
      setFiltroDataAgendamento(valor);
    } else if (chave === 'tipoAtendimento') {
      setFiltroTipoAtendimento(valor);
    } else if (chave === 'dataCancelamento') {
      setFiltroDataCancelamento(valor);
    } else if (chave != null && valor != null) {
      const updatedBodyParams = { ...bodyParams, [chave]: valor };
      setBodyParams(updatedBodyParams);
      chamarFuncao('pesquisar', updatedBodyParams);
    }
  };

  const dropdownAbrirFechar = (id: any) => {
    setDropdownAberto((prevState: any) => ({ ...prevState, [id]: !prevState[id] }));
  };

  const dropdownCliqueiFora = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownAberto({});
    }
  };

  const verificaTexto = (texto: any) => {
    // Regex para data no formato yyyy-MM-dd
    const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (typeof texto === 'string' && dataRegex.test(texto)) {
      const [ano, mes, dia] = texto.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    // Mantém o tratamento para datas ISO completas
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
    if (texto != null && iso8601Regex.test(texto)) {
      let dataString = texto;
      let data = dataString.split("T")[0];
      let hora = dataString.split("T")[1].split(".")[0];
      let dia = data.split('-')[2];
      let mes = data.split('-')[1];
      let ano = data.split('-')[0];
      return `${dia}/${mes}/${ano} ${hora}`;
    }
    return texto;
  };

  useEffect(() => {
    document.addEventListener('mousedown', dropdownCliqueiFora);
    return () => {
      document.removeEventListener('mousedown', dropdownCliqueiFora);
    };
  }, []);

  // Renderiza os filtros em um grid responsivo:
  const renderFiltros = () => {
    const filters = estrutura.tabela.colunas
      .filter((col: any) => col.pesquisar && col.chave !== 'tipoAtendimento' && col.chave !== 'data');

    return (
      <div className="flex flex-wrap gap-4 w-full">
        {/* Filtro Nome do Aluno */}
        <div className="w-full sm:w-auto flex-1 min-w-[200px] flex flex-col">
          <label className="mb-1 text-sm font-bold text-neutrals-900">
            Nome do Aluno
          </label>
          <input
            type="text"
            className="pl-2 py-1 border rounded-md text-sm"
            placeholder="Digite para filtrar"
            value={filtroNomeAluno}
            onChange={e => setFiltroNomeAluno(e.target.value)}
          />
        </div>
        {/* Filtro Tipo de Atendimento */}
        <div className="w-full sm:w-auto flex-1 min-w-[200px] flex flex-col">
          <label className="mb-1 text-sm font-bold text-neutrals-900">
            Tipo de Atendimento
          </label>
          <input
            type="text"
            className="pl-2 py-1 border rounded-md text-sm"
            placeholder="Digite para filtrar"
            value={filtroTipoAtendimento}
            onChange={e => setFiltroTipoAtendimento(e.target.value)}
          />
        </div>
        {/* Filtro Dia do Atendimento */}
        <div className="w-full sm:w-auto flex-1 min-w-[200px] flex flex-col">
          <label className="mb-1 text-sm font-bold text-neutrals-900">
            Dia do Atendimento
          </label>
          <input
            type="date"
            className="pl-2 py-1 border rounded-md text-sm"
            value={filtroDataAgendamento}
            onChange={e => setFiltroDataAgendamento(e.target.value)}
          />
        </div>
        {/* Filtro Dia do Cancelamento */}
        <div className="w-full sm:w-auto flex-1 min-w-[200px] flex flex-col">
          <label className="mb-1 text-sm font-bold text-neutrals-900">
            Dia do Cancelamento
          </label>
          <input
            type="date"
            className="pl-2 py-1 border rounded-md text-sm"
            value={filtroDataCancelamento}
            onChange={e => setFiltroDataCancelamento(e.target.value)}
          />
        </div>
      </div>
    );
  };

  // Filtra os dados no frontend conforme os filtros selecionados
  let dadosFiltrados = dados;
  if (filtroDataAgendamento) {
    dadosFiltrados = dadosFiltrados.filter((item: any) =>
      item.agendamento?.data === filtroDataAgendamento
    );
  }
  if (filtroDataCancelamento) {
    const [ano, mes, dia] = filtroDataCancelamento.split('-');
    const filtroFormatado = `${dia}/${mes}/${ano}`;
    dadosFiltrados = dadosFiltrados.filter((item: any) => {
      const dataItem = (item.dataCancelamento || '').split(' ')[0];
      return dataItem === filtroFormatado;
    });
  }
  if (filtroTipoAtendimento) {
    const filtroNormalizado = filtroTipoAtendimento
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    dadosFiltrados = dadosFiltrados.filter((item: any) => {
      const tipoAtendimentoNormalizado = (item.tipoAtendimento || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return tipoAtendimentoNormalizado.includes(filtroNormalizado);
    });
  }
  if (filtroNomeAluno) {
    const filtroNomeNormalizado = filtroNomeAluno
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    dadosFiltrados = dadosFiltrados.filter((item: any) => {
      const nomeAlunoNormalizado = (item.agendamento?.estudante?.aluno || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return nomeAlunoNormalizado.includes(filtroNomeNormalizado);
    });
  }

  return (
    <div>
      <div className="flex flex-col">
        {/* Linha de botões */}
        <div className="flex justify-between items-center overflow-x-auto mt-2.5">
          {/* Lado Esquerdo: Botão de Filtrar */}
          <div className="flex items-center">
            {estrutura.tabela.configuracoes?.pesquisar && (
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
            {estrutura.tabela.botoes &&
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
          <div className="mb-4 p-4 bg-neutrals-50 rounded-md shadow">
            {renderFiltros()}
          </div>
        )}
        {/* Tabela (Desktop) */}
        <div className="overflow-x-auto rounded-md border-2 border-neutrals-200 hidden md:block">
          <div className="min-w-full inline-block align-middle">
            <div className="rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-neutrals-200">
                <thead
                  className="bg-neutrals-50"
                  hidden={estrutura.tabela.configuracoes && !estrutura.tabela.configuracoes.cabecalho}
                >
                  <tr>
                    {estrutura.tabela.colunas.map((item: any, index: any) => (
                      <td
                        key={"menu_" + index}
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
                        </div>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutrals-200">
                  {dadosFiltrados && dadosFiltrados.length > 0 ? (
                    dadosFiltrados.map((item: any) => (
                      <tr key={item.id} className="hover:bg-neutrals-100">
                        {estrutura.tabela.colunas.map(({ chave, tipo, selectOptions }: any) => {
                          if (chave === 'acoes') {
                            // MODIFICAÇÃO: botão direto ao invés de dropdown
                            return (
                              <td
                                key="acoes"
                                className="px-6 py-2 whitespace-nowrap relative border-l border-neutrals-200 flex items-center justify-center"
                              >
                                <button
                                  onClick={() => chamarFuncao('deletar', item)}
                                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                                >
                                  Cancelar
                                </button>
                              </td>
                            );
                          } else if (item[chave] !== undefined && tipo === "status") {
                            const selectOption = selectOptions.find(
                              (option: any) => option.chave === item[chave]
                            );
                            if (selectOption) {
                              let element;
                              switch (selectOption.valor) {
                                case 'Finalizado':
                                  element = (
                                    <td
                                      key={chave}
                                      className="px-6 py-2 whitespace-nowrap flex items-center font-normal"
                                    >
                                      <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-green-100 text-green-800">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                                  break;
                                case 'Erro':
                                  element = (
                                    <td
                                      key={chave}
                                      className="px-6 py-2 whitespace-nowrap flex items-center font-normal"
                                    >
                                      <span className="px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-red-100 text-red-800">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                                  break;
                                default:
                                  element = (
                                    <td
                                      key={chave}
                                      className="px-6 py-2 whitespace-nowrap flex items-center font-normal"
                                    >
                                      <span className="px-3 inline-flex text-sm leading-6 font-normal rounded-full bg-neutrals-100 text-neutrals-800">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                              }
                              return element;
                            }
                          } else if (item[chave] !== undefined && (tipo === "booleano" || selectOptions)) {
                            const selectOption = selectOptions.find(
                              (option: any) => option.chave === item[chave]
                            );
                            if (selectOption) {
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                  <div className={`py-2 text-center rounded-md text-label-medium font-normal ${selectOption.chave === true || selectOption.chave === "APROVADA" ? "bg-success-100 text-success-900" : selectOption.chave === "PENDENTE" ? "bg-warning-100 text-warning-900" : "bg-danger-100 text-danger-900"}`}>
                                    {selectOption.valor}
                                  </div>
                                </td>
                              );
                            } else {
                              return null;
                            }
                          } else if (tipo === "json") {
                            const partes = chave.split('|');
                            let key = partes[0];
                            let jsonKey = partes[1];
                            let jsonItem = JSON.parse(item[key]);
                            if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                  {verificaTexto(jsonItem[jsonKey])}
                                </td>
                              );
                            } else {
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal"></td>;
                            }
                          } else if (tipo === "quantidade" && Array.isArray(item[chave])) {
                            // SUPORTE À QUANTIDADE DE ITENS DO ARRAY
                            return (
                              <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                {item[chave].length}
                              </td>
                            );
                          } else if (item[chave] !== undefined) {
                            if (typeof item[chave] !== 'object') {
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                  {verificaTexto(item[chave])}
                                </td>
                              );
                            } else if (Array.isArray(item[chave])) {
                              // SUPORTE A ARRAYS
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                  {item[chave].length > 0 ? (
                                    <ul className="list-disc pl-4">
                                      {item[chave].map((element: any, idx: number) => (
                                        <li key={idx}>
                                          {element.horaInicio && element.horaFim
                                            ? `${element.horaInicio} - ${element.horaFim}`
                                            : JSON.stringify(element)}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span>-</span>
                                  )}
                                </td>
                              );
                            } else {
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal"></td>;
                            }
                          } else if (item[chave] === undefined) {
                            const keys = chave.split('.');
                            let nestedValue = item;
                            for (let key of keys) {
                              if (nestedValue) {
                                nestedValue = nestedValue[key];
                                if (nestedValue === undefined) break;
                              }
                            }
                            if (tipo === "quantidade" && Array.isArray(nestedValue)) {
                              // SUPORTE À QUANTIDADE DE ITENS DO ARRAY ANINHADO
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                  {nestedValue.length}
                                </td>
                              );
                            }
                            if (typeof nestedValue !== 'object' && nestedValue !== undefined) {
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                  {verificaTexto(nestedValue)}
                                </td>
                              );
                            } else if (Array.isArray(nestedValue)) {
                              // SUPORTE A ARRAYS EM OBJETOS ANINHADOS
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal">
                                  {nestedValue.length > 0 ? (
                                    <ul className="list-disc pl-4">
                                      {nestedValue.map((element: any, idx: number) => (
                                        <li key={idx}>
                                          {element.horaInicio && element.horaFim
                                            ? `${element.horaInicio} - ${element.horaFim}`
                                            : JSON.stringify(element)}
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <span>-</span>
                                  )}
                                </td>
                              );
                            } else {
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap font-normal"></td>;
                            }
                          }
                          return null;
                        })}
                      </tr>
                    ))
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

        {/* Layout Stacked (Mobile) */}
        <div className="block md:hidden">
          {dadosFiltrados && dadosFiltrados.length > 0 ? (
            dadosFiltrados.map((item: any) => (
              <div
                key={item.id}
                className="bg-white border border-neutrals-200 rounded-md p-4 mb-4 shadow"
              >
                {estrutura.tabela.colunas.map((col: any, index: number) => {
                  if (col.chave === 'acoes') {
                    // No mobile, exibe o botão de cancelar diretamente
                    return (
                      <div key={col.chave} className="mt-2 flex justify-end gap-2">
                        <button
                          className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-md"
                          onClick={() => chamarFuncao('deletar', item)}
                        >
                          Cancelar
                        </button>
                      </div>
                    );
                  } else {
                    let label = col.nome;
                    let value: any = '';
                    if (col.tipo === "quantidade" && Array.isArray(item[col.chave])) {
                      value = item[col.chave].length;
                    } else if (item[col.chave] !== undefined) {
                      if (typeof item[col.chave] !== 'object') {
                        value = verificaTexto(item[col.chave]);
                      } else if (Array.isArray(item[col.chave])) {
                        value = (
                          <ul className="list-disc pl-4">
                            {item[col.chave].map((element: any, idx: number) => (
                              <li key={idx}>
                                {element.horaInicio && element.horaFim
                                  ? `${element.horaInicio} - ${element.horaFim}`
                                  : JSON.stringify(element)}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                    } else {
                      const keys = col.chave.split('.');
                      let nestedValue = item;
                      for (let key of keys) {
                        if (nestedValue) {
                          nestedValue = nestedValue[key];
                        }
                      }
                      if (col.tipo === "quantidade" && Array.isArray(nestedValue)) {
                        value = nestedValue.length;
                      } else if (nestedValue !== undefined && typeof nestedValue !== 'object') {
                        value = verificaTexto(nestedValue);
                      } else if (Array.isArray(nestedValue)) {
                        value = (
                          <ul className="list-disc pl-4">
                            {nestedValue.map((element: any, idx: number) => (
                              <li key={idx}>
                                {element.horaInicio && element.horaFim
                                  ? `${element.horaInicio} - ${element.horaFim}`
                                  : JSON.stringify(element)}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                    }
                    if (col.tipo === "status" && col.selectOptions) {
                      const selectOption = col.selectOptions.find((option: any) => option.chave === item[col.chave]);
                      if (selectOption) {
                        value = (
                          <span
                            className={
                              selectOption.valor === 'Finalizado'
                                ? 'px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-green-100 text-green-800'
                                : selectOption.valor === 'Erro'
                                  ? 'px-2 inline-flex text-sm leading-5 font-normal rounded-full bg-red-100 text-red-800'
                                  : 'px-3 inline-flex text-sm leading-6 font-normal rounded-full bg-neutrals-100 text-neutrals-800'
                            }
                          >
                            {selectOption.valor}
                          </span>
                        );
                      }
                    } else if (item[col.chave] !== undefined && (col.tipo === "booleano" || col.selectOptions)) {
                      const selectOption = col.selectOptions.find((option: any) => option.chave === item[col.chave]);
                      if (selectOption) {
                        value = selectOption.valor;
                      }
                    } else if (col.tipo === "json") {
                      const partes = col.chave.split('|');
                      let key = partes[0];
                      let jsonKey = partes[1];
                      let jsonItem = JSON.parse(item[key]);
                      if (jsonItem && typeof jsonItem[jsonKey] !== 'object') {
                        value = verificaTexto(jsonItem[jsonKey]);
                      }
                    }
                    return (
                      <div key={index} className="mb-2">
                        <span className="block text-sm font-bold text-neutrals-900">
                          {label}:
                        </span>
                        <span className="block text-sm text-neutrals-700 font-normal">{value}</span>
                      </div>
                    );
                  }
                })}
              </div>
            ))
          ) : (
            <div className="text-center py-4 font-normal">
              <h6 className="text-neutrals-600">Nenhum registro encontrado.</h6>
            </div>
          )}
        </div>
      </div>
      {estrutura.tabela.configuracoes.rodape && (
        <Pagination dados={dadosFiltrados} paramsColuna={paramsColuna} />
      )}
    </div>
  );
};

export default Tabela;