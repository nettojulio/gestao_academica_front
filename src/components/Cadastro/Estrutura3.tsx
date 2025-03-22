

const Cadastro3 = ({ estrutura = null, dadosPreenchidos = null, setDadosPreenchidos = null, chamarFuncao = null }: any) => {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data: any = {};

    // Capturar todos os checkboxes
    const checkboxes = event.target.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox: any) => {
        // Se o checkbox não estiver marcado, adicionar com valor "false"
        if (!formData.has(checkbox.name)) {
            formData.append(checkbox.name, "false");
        }
    });

    formData.forEach((value, key: any) => {
      // Converter valor de checkbox para booleano
      if (value === 'on') {
          data[key] = true;
      } else if (value === 'false') {
          data[key] = false;
      } else {
          data[key] = value; // para outros campos, apenas o valor simples
      }
    });

    chamarFuncao('salvar', data);
  };

  const alterarInput = (event: any) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prevData: any) => ({
      ...prevData,
      [name]: value
    }));
  };

  function findFieldByKey(estrutura: any, chaveBuscada: any) {
    // Verifica se estrutura e chaveBuscada são válidos
    if (!estrutura || !chaveBuscada) return null;
  
    // Estrutura de campos está dentro de estrutura.cadastro.campos que é uma matriz de arrays
    for (let grupoDeCampos of estrutura.cadastro.campos) {
      for (let campo of grupoDeCampos) {
        if (campo.chave === chaveBuscada) {
          return campo;
        }
      }
    }
  }

  const alterarSelect = (event: any, keyName=null) => {
    const { name, value } = event.target;

    const field = findFieldByKey(estrutura, keyName);

    if ('onChange' in field)
      chamarFuncao && chamarFuncao(field["onChange"], value);

    setDadosPreenchidos && setDadosPreenchidos((prevData: any) => {
      const updatedData = { ...prevData, [name]: value };

      // Verifica se a opção selecionada tem valores padrão associados
      estrutura.cadastro.campos.forEach((campoGroup: any) => 
      {
          campoGroup.forEach((campo: any) => 
          {
              if (campo.tipo === 'select' && campo.selectOptions) 
              {
                  const selectedOption = campo.selectOptions.find((option: any) => option.chave === value);

                  if (selectedOption?.valorDefault) 
                  {
                      selectedOption.valorDefault.forEach(({ campo, valor }: any) => {
                        updatedData[campo] = valor;
                      });
                  }
              }
          });
      });

      return updatedData;
    });
  };

  const alterarCheckbox = (event: any) => {
    const { name, checked } = event.target;

    setDadosPreenchidos((prevData: any) => ({
      ...prevData,
      [name]: checked
    }));
  };

  const alterarDate = (event: any) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prevData: any) => ({
      ...prevData,
      [name]: value
    }));
  };

  function formatDateString(inputString: string) {
    const date = new Date(inputString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const isConditionMet = (condicoes: any) => {

    if (condicoes === undefined || condicoes === null  || condicoes == '') 
      return true;

    if (!condicoes) return true;
    if (!Array.isArray(condicoes)) condicoes = [condicoes];

    var resultado = true;

    resultado = condicoes.some((condicao: any) => 
      {
        if (dadosPreenchidos && condicao.campo in dadosPreenchidos && dadosPreenchidos[condicao.campo] && dadosPreenchidos[condicao.campo] === condicao.valor)
          return true;
        
        return false;
      }
    );

    return resultado;
  };

  const isConditionExclusivaMet = (condicoes: any) => {
    if (condicoes === undefined || condicoes === null || condicoes == '') 
      return true;

    if (!condicoes) return true;
    if (!Array.isArray(condicoes)) condicoes = [condicoes];

    return condicoes.every((condicao: any) => dadosPreenchidos[condicao.campo] === condicao.valor);
  };

  return (
    <div>
      <form className="w-full pt-2 pb-2" onSubmit={handleSubmit}>
        {/* campo id oculto */}
        <input type="hidden" name="id" value={dadosPreenchidos?.id || ''} />
        {/* campo id oculto */}
        {estrutura != null && estrutura.cadastro.campos.map((elemento: any, index: any) => (
          <div className="md:flex" key={index}>
            {elemento.map((e: any, idx: any) => (
              
              //renderizar todos os campos que não condicao e condicaoExclusiva
              ((e.condicao == null && e.condicaoExclusiva == null) ||
              //ou se existir, renderizar se atender as condicoes
              (isConditionMet(e.condicao) && isConditionExclusivaMet(e.condicaoExclusiva))) && (
              <div className="flex-grow mb-2 me-2 w-full" key={idx}>
                {e.tipo === "subtitulo" && <h2 className="text-2xl " style={{ color: '#5F84A1' }}>"X"{e.nome}</h2>}
                {e.tipo === "text" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
                      <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                    </label>
                    <input
                      type="text"
                      id={e.chave}
                      name={e.chave}
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder={e.mensagem}
                      value={dadosPreenchidos && dadosPreenchidos[e.chave] || ''}
                      onChange={alterarInput}
                      disabled={e.bloqueado}
                      required={e.obrigatorio}
                    />
                  </>
                )}
                {e.tipo === "number" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
                      <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                    </label>
                    <input
                      type="number"
                      id={e.chave}
                      name={e.chave}
                      className="mt-1 p-2 w-full border rounded-md"
                      placeholder={e.mensagem}
                      value={dadosPreenchidos && dadosPreenchidos[e.chave] || ''}
                      onChange={alterarInput}
                      disabled={e.bloqueado}
                      required={e.obrigatorio}
                    />
                  </>
                )}
                {e.tipo === "select" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
                      <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                    </label>
                    <select
                      id={e.chave}
                      name={e.chave}
                      className="mt-1 p-2 w-full border rounded-md bg-white"
                      value={dadosPreenchidos && dadosPreenchidos[e.chave] || ''}
                      onChange={(event) => alterarSelect(event, e.chave)}
                      disabled={e.bloqueado}
                      required={e.obrigatorio}
                    >
                      {e.selectOptions && e.selectOptions.map((option: any, optionIdx: any) => (
                        <option key={optionIdx} value={option.chave}>{option.valor}</option>
                      ))}
                    </select>
                  </>
                )}
                {e.tipo === 'selectDB' && !e.oculto && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                        {/* { JSON.stringify(dadosPreenchidos) } */}
                        <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                      </label>

                      <select
                        id={e.chave}
                        name={e.chave}
                        className="mt-1 p-2 w-full border rounded-md bg-white"
                        value={dadosPreenchidos && dadosPreenchidos[e.chave] || ''}
                        onChange={(event) => alterarSelect(event, e.chave)}
                        disabled={e.bloqueado}
                        required={e.obrigatorio}
                      >
                        <option value="" disabled>Selecione</option>
                        {e.selectOptions && e.selectOptions.map((option: any, optionIdx: any) => (
                          isConditionMet(option.condicao) && isConditionExclusivaMet(option.condicao) && 
                          (
                            <option key={optionIdx} value={option.chave}>{option.valor}</option>
                          )
                        ))}
                      </select>
                    </>
                  )}
                {e.tipo === "boolean" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
                      <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                    </label>
                    <input
                      type="checkbox"
                      id={e.chave}
                      name={e.chave}
                      className="mt-1 p-2 ml-2 border rounded-md"
                      checked={dadosPreenchidos && dadosPreenchidos[e.chave] || false}
                      onChange={alterarCheckbox}
                      disabled={e.bloqueado}
                      required={e.obrigatorio}
                    />
                  </>
                )}
                {e.tipo === "date" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
                      <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                    </label>
                    <input
                      type="date"
                      id={e.chave}
                      name={e.chave}
                      className="mt-1 p-2 w-full border rounded-md"
                      value={dadosPreenchidos && dadosPreenchidos[e.chave] || ''}
                      onChange={alterarDate}
                      disabled={e.bloqueado}
                      required={e.obrigatorio}
                    />
                  </>
                )}
                {e.tipo === "label" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
                      {/* <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp> */}
                    </label>
                    <p className="mt-1 p-2 w-full">{dadosPreenchidos && dadosPreenchidos[e.chave] || ''}</p>
                    {/* <p className="mt-1 p-2 w-full border rounded-md">{dadosPreenchidos && dadosPreenchidos[e.chave] || ''}</p> */}
                    {/* <input 
                      type="date"
                      id={e.chave}
                      name={e.chave}
                      className="mt-1 p-2 w-full border rounded-md"
                      value={dadosPreenchidos && dadosPreenchidos[e.chave] || ''}
                      onChange={alterarDate}
                      disabled={e.bloqueado}
                      required={e.obrigatorio}
                    /> */}
                  </>
                )}
                {e.tipo === "labelDate" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}</label>
                    <p className="mt-1 p-2 w-full">{dadosPreenchidos && formatDateString(dadosPreenchidos[e.chave]) || ''}</p>
                  </>
                )}
                {e.tipo === "labelObject" && (
                  <>
                    <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}</label>
                    <p className="mt-1 p-2 w-full">
                        {dadosPreenchidos && dadosPreenchidos[e.chave] != null ? dadosPreenchidos[e.chave] : e.valorPadraoForNull}
                    </p>
                  </>
                )}
                {e.oculto && e.oculto == false && e.tipo !== "text" && e.tipo !== "labelDate" && e.tipo !== "select" && e.tipo !== "selectDB"  && e.tipo !== "boolean" && e.tipo !== "subtitulo" && (
                  <div className="mt-1 p-2 w-full bg-red-100">{e.oculto}</div> // Renderiza uma div vazia se o tipo de campo não for reconhecido
                )}
              </div>
            )
            ))}
          </div>
        ))}
        <div className='flex justify-end'>
          {estrutura != null && estrutura.cadastro.acoes.map((botao: any, index: any) => (
            <button 
              key={index}
              type={botao.tipo === 'submit' ? 'submit' : 'button'}
              className='bg-gray-100 me-2 border rounded px-2 py-1'
              onClick={botao.tipo !== 'submit' ? () => chamarFuncao(botao.chave, botao) : undefined} // Adiciona onClick apenas se o tipo não for submit
            >
              {botao.nome}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Cadastro3;
