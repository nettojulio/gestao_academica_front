import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import Pagination from './Itens/Paginacao2';

const Tabela = forwardRef(({ dados = null, estrutura = null, chamarFuncao = null }: any, ref) => {
  const [dropdownAberto, setDropdownAberto] = useState<any>({});
  const dropdownRef = useRef<any>(null);

  const [bodyParams, setBodyParams] = useState<any>({
    size: 25,
  }); 

   useImperativeHandle(ref, () => ({
    getBodyParams: () => bodyParams, 
    resetarFiltros: () => {
      setBodyParams({ size: bodyParams.size, page: 0 });
      estrutura.tabela.colunas.forEach((coluna: any, index: number) => {
        const input = document.getElementById(`pesquisar_coluna_${index}`) as HTMLInputElement | null;
        if (input) {
          input.value = ''; // Limpa o valor dos campos de filtro
        }
      });
    },
  }));

  const paramsColuna = (chave: any = null, valor: any = null) => {
    if(chave != null && valor != null){
      const updatedBodyParams = {
        ...bodyParams,
        [chave]: valor,
        ['page']: 0, //retornar para a página 0 a cada consulta
      };

      setBodyParams(updatedBodyParams);
      chamarFuncao('pesquisar', updatedBodyParams);
    }
  }

  const pageNavigation = (chave: any = null, valor: any = null) => {
    if(chave != null && valor != null){
      const updatedBodyParams = {
        ...bodyParams,
        [chave]: valor,
      };

      setBodyParams(updatedBodyParams);
      chamarFuncao('pesquisar', updatedBodyParams);
    }
  }

  // Função para alternar o estado do dropdown
  const dropdownAbrirFechar = (id) => {
    setDropdownAberto((prevState) => ({
      ...prevState,
      [id]: !prevState[id] 
    }));
  };

  const dropdownCliqueiFora = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownAberto({});
    }
  };

  const verificaTexto = (texto) => {
    const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
    if(texto != null && iso8601Regex.test(texto)){

      let dataString = texto;
      let data = dataString.split("T")[0];
      let hora = dataString.split("T")[1].split(".")[0];

      let dia = data.split('-')[2];
      let mes = data.split('-')[1];
      let ano = data.split('-')[0];
      return dia+"/"+mes+"/"+ano+" "+hora;
    }else{
      return texto;
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', dropdownCliqueiFora);
    return () => {
      document.removeEventListener('mousedown', dropdownCliqueiFora);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col">
        <div className='flex justify-end overflow-x-auto mt-2.5'>
          {estrutura != null ? (estrutura.tabela.botoes.map((botao,index) =>(
            <button key={index} className='ml-2 mb-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 border rounded' disabled={botao.bloqueado} hidden={botao.oculto}
                    onClick={() => chamarFuncao(botao.chave, botao)}>{botao.nome}</button>
          ))):('')}
        </div>
        <div className="overflow-x-auto">
          <div className="p-1 min-w-full inline-block align-middle">
            <div className="border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                {/* titulo das colunas */}
                <thead className="bg-gray-50" hidden={estrutura.tabela.configuracoes != undefined && (!estrutura.tabela.configuracoes.cabecalho )}>
                  <tr>
                    {/* {estrutura != null ? (estrutura.tabela.colunas.map((item,index) => ( */}
                    {estrutura != null ? (estrutura.tabela.colunas.filter((coluna) => coluna.oculto === undefined || coluna.oculto === false).map((item,index) => (
                      <td
                        key={"menu_" + index}
                        className={`px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-800 uppercase text-gray-600 ${
                          //item.nome === "ações" ? "bg-white" : ""
                          item.nome === "ações" ? "bg-gray-50" : ""
                        }`}
                        style={item.nome === "ações" ? { position: "sticky", right: 0, zIndex: 2 } : {}}
                        // title={item.hint || ""}
                      > 
                        <div className="flex items-center">
                          {item.nome}

                          {/* {item.hint && (
                            <div className="ml-2 relative group">
                              <svg
                                className="w-5 h-5 text-gray-800 dark:text-white cursor-pointer"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )} */}
          
                          <button
                            key={index}
                            className="ml-2"
                            onClick={() => paramsColuna('sort', bodyParams.sort != null && bodyParams.sort.split(',')[1] === 'asc' ? `${item.chave},desc` : `${item.chave},asc` )}
                            hidden={!item.sort}
                          >{bodyParams.sort != null && bodyParams.sort.split(',')[0] === item.chave && bodyParams.sort.split(',')[1] === 'asc' ? '▲' : '▼'}
                          </button>
                        </div>
                      </td>
                    ))) : ('')}
                  </tr>
                </thead>
                {/* pesquisar nas colunas */}
                <thead className="bg-gray-50" hidden={estrutura.tabela.configuracoes != undefined && (!estrutura.tabela.configuracoes.pesquisar )}>
                  <tr>
                    {estrutura != null ? (estrutura.tabela.colunas.filter((coluna) => coluna.oculto === undefined || coluna.oculto === false).map((item,index)  => (
                        <td key={"pesquisa_" + index} className={`px-6 py-1 w-full ${item.nome === "ações" ? "bg-gray-50 text-white" : ""}`} style={item.nome === "ações" ? { position: "sticky", right: 0, zIndex: 2 } : {}}>
                          {(item.tipo === 'texto' || item.tipo === 'json')  && !(item.selectOptions && item.selectOptions.length > 0) && (
                            <input
                              type="text"
                              id={'pesquisar_coluna_' + index}
                              className='pl-1 w-full border rounded text-sm'
                              placeholder='Pesquisar'
                              hidden={!item.pesquisar || item.pesquisar == undefined}
                              onChange={(e) => paramsColuna(item.chave, e.target.value)}
                            />
                          )}
                          {item.tipo === 'booleano' && (
                            <select
                              id={'pesquisar_coluna_' + index}
                              className='pl-1 w-full border rounded text-sm bg-white'
                              hidden={!item.pesquisar || item.pesquisar == undefined}
                              onChange={(e) => paramsColuna(item.chave, e.target.value)}
                            >
                              {/* Exibe "Selecionar" apenas se "Todos" não existir */}
                              {!item.selectOptions.some(option => option.valor === "Todos") && (
                                <option value="">Selecionar</option>
                              )}
                              {item.selectOptions.map(option => (
                                <option key={option.chave} value={option.chave}>{option.valor}</option>
                              ))}
                            </select>
                          )}
                          {item.tipo === 'texto' && item.selectOptions && item.selectOptions.length > 0 && (
                              <select
                                id={'pesquisar_coluna_' + index}
                                className='pl-1 w-full border rounded text-sm bg-white'
                                hidden={!item.pesquisar || item.pesquisar == undefined}
                                onChange={(e) => paramsColuna(item.chave, e.target.value)}
                              >
                                <option value="">Selecionar</option>
                                {item.selectOptions.map(option => (
                                  <option key={option.chave} value={option.chave}>{option.valor}</option>
                                ))}
                              </select>
                          )}
                        </td>
                      ))
                    ) : ('')}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dados && dados.content && dados.content.length > 0 ? (
                    dados.content.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-100">
                        {estrutura.tabela.colunas.filter((coluna) => coluna.oculto === undefined || coluna.oculto === false).map(({ chave, tipo, selectOptions, chave2, hint }: any) => {
                          //(estrutura.tabela.colunas.filter((coluna) => coluna.oculto === undefined || coluna.oculto === false).map((item,index) 

                          if (chave === 'acoes') {
                            return (
                              <td
                                key="acoes"
                                className="px-6 py-2 whitespace-nowrap relative bg-white"
                                style={{ position: 'sticky', right: 0, zIndex: 1 }}
                              >
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
                                    {estrutura?.tabela?.acoes_dropdown.map((acao, index_acao) => (
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
                            )
                          }
                          else if (item[chave] !== undefined && tipo === "status") {
                            const selectOption = selectOptions.find(option => option.chave === item[chave]);
                            if (selectOption) {
                              let element;  // Variável para armazenar o elemento a ser retornado
                              switch (selectOption.valor) {
                                case 'Finalizado':
                                  element = (
                                    <td key={chave} className="px-6 py-2 whitespace-nowrap flex  items-center">
                                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 justify-center items-center">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                                  break;
                                case 'Erro':
                                  element = (
                                    <td key={chave} className="px-6 py-2 whitespace-nowrap flex  items-center">
                                      <span className="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-red-100 text-red-800 justify-center items-center">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );
                                  break;
                                default:
                                  element = (
                                    <td key={chave} className="px-6 py-2 whitespace-nowrap flex  items-center">
                                      <span className="px-3 inline-flex text-sm leading-6 font-semibold rounded-full bg-gray-100 text-gray-800 justify-center items-center">
                                        {selectOption.valor}
                                      </span>
                                    </td>
                                  );                               }
                              return element;  // Retorna o elemento conforme decidido pelo switch
                            }
                          } else if (item[chave] !== undefined && (tipo == "booleano" || selectOptions)) {
                            const selectOption = selectOptions.find(option => option.chave === item[chave]);
                            if (selectOption) {
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap">{selectOption.valor}</td>
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
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap">{verificaTexto(jsonItem[jsonKey])}</td>;
                            } else {
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap"></td>;
                            }
                          } else if (item[chave] !== undefined) {
                            if (typeof item[chave] !== 'object') {
                              if (chave === 'nome') {
                                return (
                                  <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                    {item[chave2] === true && hint ? (
                                      // <span className="text-red-600 text-sm">{hint}</span>

                                      <span className="text-red-600 text-sm flex items-center gap-2">
                                        <span className="font-bold" title={hint || ""}>{verificaTexto(item[chave])}</span>

                                        {/* <span title={hint || ""}>
                                          {(
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                              <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v5a1 1 0 1 0 2 0V8Zm-1 7a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clip-rule="evenodd"/>
                                            </svg>
                                          
                                          )}
                                        </span> */}
                                      </span>
                                    ) 
                                    : 
                                    (
                                      verificaTexto(item[chave]) // Exibe o valor padrão da coluna
                                    )}
                                  </td>
                                );
                              }
                            
                              // Caso chave não seja 'nome'
                              return (
                                <td key={chave} className="px-6 py-2 whitespace-nowrap">
                                  {verificaTexto(item[chave])}
                                </td>
                              );
                            }
                            
                            else {
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap"></td>;
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
                            if (typeof nestedValue !== 'object') {
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap">{verificaTexto(nestedValue)}</td>;
                            } else {
                              return <td key={chave} className="px-6 py-2 whitespace-nowrap"></td>;
                            }
                          }
                          return null;
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={estrutura.tabela.colunas.length} className="text-center py-4">
                        <h6 className='text-gray-600'>Nenhum registro encontrado.</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      { estrutura.tabela.configuracoes.rodape ? (
        <Pagination dados={dados} paramsColuna={pageNavigation}/>
      ) : ('')}
    </div>
  );
});

export default Tabela;