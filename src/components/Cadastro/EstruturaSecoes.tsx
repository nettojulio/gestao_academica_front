import dynamic from "next/dynamic";
import CepSearch from "../CEP/CepSearch";
import AddableSelect from '@/components/Cadastro/AddableSelect';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Locale } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR as unknown as Locale);


const DynamicMap = dynamic(() => import('../MapaUnidadesAps/Mapa'), {
    ssr: false
});

const CadastroComSecoes = ({ 
    mapRef= null,
    titulosSecoes = null, 
    estrutura = null, 
    dadosForm = null, 
    setDadosForm = null, 
    chamarFuncao = null
 }: any) => {

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {};

    // Capturar todos os checkboxes
    const checkboxes = event.target.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        // Se o checkbox não estiver marcado, adicionar com valor "false"
        if (!formData.has(checkbox.name)) 
            formData.append(checkbox.name, "false");
    });

    formData.forEach((value, key) => {
      // Converter valor de checkbox para booleano
      if (value === 'on') 
          data[key] = true;
      else if (value === 'false')
          data[key] = false;
      else 
          data[key] = value; // para outros campos, apenas o valor simples
    });

    chamarFuncao && chamarFuncao('salvar', data);
  };

  const alterarInput = (event) => {
    const { name, value } = event.target;
    setDadosForm((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  function findFieldByKey(estrutura, chaveBuscada) {
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

  const onBlurHandle = (event, keyName=null) => {
    const { name, value } = event.target;

    const field = findFieldByKey(estrutura, keyName);

    if ('onBlur' in field)
      chamarFuncao(field["onBlur"], value);
  };

  const alterarSelect = (event, keyName=null) => {
    const { name, value } = event.target;

    const field = findFieldByKey(estrutura, keyName);

    if ('onChange' in field)
      chamarFuncao(field["onChange"], value);

    setDadosForm((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Verifica se a opção selecionada tem valores padrão associados
      estrutura.cadastro.campos.forEach((campoGroup) => 
      {
          campoGroup.forEach((campo) => 
          {
              if (campo.tipo === 'select' && campo.selectOptions) 
              {
                  const selectedOption = campo.selectOptions.find((option) => option.chave === value);

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

  const alterarCheckbox = (event) => {
    const { name, checked } = event.target;

    setDadosForm((prevData) => ({
      ...prevData,
      [name]: checked
    }));
  };

  const alterarDate = (event) => {
    const { name, value } = event.target;
    setDadosForm((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  function formatDateString(inputString) {
    const date = new Date(inputString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  const isConditionMet = (condicoes) => {

    if (condicoes === undefined || condicoes === null  || condicoes == '') 
      return true;

    if (!condicoes) return true;
    if (!Array.isArray(condicoes)) condicoes = [condicoes];

    var resultado = true;

    resultado = condicoes.some((condicao) => 
      {
        if (dadosForm && condicao.campo in dadosForm && dadosForm[condicao.campo] && dadosForm[condicao.campo] === condicao.valor)
          return true;
        
        return false;
      }
    );

    return resultado;
  };

  const isConditionExclusivaMet = (condicoes) => {
    if (condicoes === undefined || condicoes === null || condicoes == '') 
      return true;

    if (!condicoes) return true;
    if (!Array.isArray(condicoes)) condicoes = [condicoes];

    return condicoes.every((condicao) => dadosForm[condicao.campo] === condicao.valor);
  };

  const renderCampos = (campos) => {
    return  campos.map((e, idx) => (
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
              value={dadosForm && dadosForm[e.chave] || ''}
              onChange={alterarInput}
              onBlur={(event) => onBlurHandle(event, e.chave)}
              style={e.bloqueado ? { backgroundColor: '#f0f0f0', color: '#a0a0a0' } : {}}
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
              value={dadosForm && dadosForm[e.chave] || ''}
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
              value={dadosForm && dadosForm[e.chave] || ''}
              onChange={(event) => alterarSelect(event, e.chave)}
              disabled={e.bloqueado}
              required={e.obrigatorio}
            >
              {e.selectOptions && e.selectOptions.map((option, optionIdx) => (
                <option key={optionIdx} value={option.chave}>{option.valor}</option>
              ))}
            </select>
          </>
        )}
        {e.tipo === 'selectDB' && !e.oculto && (
            <>
              <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                {e.nome}
                <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
              </label>

              <select
                id={e.chave}
                name={e.chave}
                className="mt-1 p-2 w-full border rounded-md bg-white"
                value={dadosForm && dadosForm[e.chave] || ''}
                onChange={(event) => alterarSelect(event, e.chave)}
                disabled={e.bloqueado}
                required={e.obrigatorio}
              >
                <option value="" disabled>Selecione</option>
                {e.selectOptions && e.selectOptions.map((option, optionIdx) => (
                  isConditionMet(option.condicao) && isConditionExclusivaMet(option.condicao) && 
                  (
                    <option key={optionIdx} value={option.chave}>{option.valor}</option>
                  )
                ))}
              </select>
            </>
        )}

        {e.tipo === 'AddableSelectDB' && !e.oculto && (
            <AddableSelect dadosForm={dadosForm} campo={e} setDadosForm={setDadosForm} chamarFuncao={chamarFuncao} />
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
              checked={dadosForm && dadosForm[e.chave] || false}
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
            <div className="datepicker-wrapper">
            <DatePicker
              selected={dadosForm && dadosForm[e.chave] ? new Date(dadosForm[e.chave]) : null}
              onChange={(date) => alterarDate({ target: { value: date, name: e.chave } })}
              id={e.chave}
              name={e.chave}
              className="mt-1 p-2 w-full border rounded-md"
              wrapperClassName="mt-1 w-full"
              locale="pt-BR"
              dateFormat="dd/MM/yyyy"
              disabled={e.bloqueado}
              required={e.obrigatorio}
            />
            </div>
            {/* <input
              type="date"
              id={e.chave} 
              name={e.chave} 
              className="mt-1 p-2 w-full border rounded-md" 
              value={dadosForm && dadosForm[e.chave] || ''}
              onChange={alterarDate}
              disabled={e.bloqueado} 
              required={e.obrigatorio} 
            /> */}
          </>
        )}
        {e.tipo === "label" && (
          <>
            <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
              {/* <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp> */}
            </label>
            <p className="mt-1 p-2 w-full">{dadosForm && dadosForm[e.chave] || ''}</p>
          </>
        )}
        {e.tipo === "labelDate" && (
          <>
            <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}</label>
            <p className="mt-1 p-2 w-full">{dadosForm && formatDateString(dadosForm[e.chave]) || ''}</p>
          </>
        )}
        {e.tipo === "labelObject" && (
          <>
            <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}</label>
            <p className="mt-1 p-2 w-full">
                {dadosForm && dadosForm[e.chave] != null ? dadosForm[e.chave] : e.valorPadraoForNull}
            </p>
          </>
        )}
        {e.tipo === "cep" && (
          <>
            <label htmlFor={e.chave} className="block text-gray-700 uppercase">{e.nome}
              <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
            </label>
            <CepSearch
              id={e.chave}
              name={e.chave}
              className="mt-1 p-2 w-full border rounded-md"
              placeholder={e.mensagem}
              value={dadosForm && dadosForm[e.chave] || ''}
              onChange={alterarInput}
              disabled={e.bloqueado}
              required={e.obrigatorio}
              setDadosBuscaPorCEP={e.setDadosBuscaPorCEP}
              setCepsProibidos={e.setCepsProibidos}
              tipoRestricao={e.tipoRestricao}
              campoRestricao={e.campoRestricao}
            />
          </>
        )}
        {e.tipo === "mapa" && e.cidade &&  (
          <div className="flex flex-wrap justify-center  border rounded-lg ">
          {/* <h1 className='text-3xl flex-grow m-3  w-full' style={{ color: '#5F84A1' }}>Mapa</h1> */}
          {/* <div className='w-full info-text bg-gray-100 p-4 rounded-md'>
            <p className='text-gray-600'>
            Um duplo clique no mapa adiciona ou move a localização da unidade APS para o local desejado. 
           </p>
            <p className='text-gray-600'> 
            A localização também pode ser movida para um novo local ao clicar sobre ela e arrastar para o local desejado.
            {JSON.stringify(e.localizacao)}
            </p>
          </div> */}

          <div className="w-full info-text bg-gray-100 p-4 rounded-md flex items-center">
            <img 
                src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png"
                alt="Error icon"
                className="w-8 h-8 mr-4 object-contain"
            />
            <div>
                <p className="text-gray-600">
                    Um duplo clique no mapa adiciona ou move o marcador da localização da unidade APS para o local desejado.
                </p>
                <p className="text-gray-600">
                    O marcador também pode ser movido ao clicar sobre ele e arrastá-lo para o novo local.
                </p>
            </div>
          </div>
          
          <DynamicMap 
            mapRef={mapRef}  
            chamarFuncao={chamarFuncao}
            cidade={e.cidade} 
            localizacao={e.localizacao}
          />

        </div> 
        )}                     
        {e.oculto && e.oculto == false && e.tipo !== "text" && e.tipo !== "labelDate" && e.tipo !== "select" && e.tipo !== "selectDB"  && e.tipo !== "boolean" && e.tipo !== "subtitulo" && (
          <div className="mt-1 p-2 w-full bg-red-100">{e.oculto}</div> // Renderiza uma div vazia se o tipo de campo não for reconhecido
        )}
      </div>
    )));
  };

  return (
    <div>
      <form className="w-full pt-2 pb-2" onSubmit={handleSubmit}>
        {/* campo id oculto */}
        <input type="hidden" name="id" value={dadosForm?.id || ''} />
        {estrutura != null && titulosSecoes && estrutura.cadastro.campos.reduce((acc, linha) => {
          linha.forEach((campo) => {
            if (!acc[campo.secao]) acc[campo.secao] = [];
          });
          acc[linha[0].secao].push(linha);
          return acc;
        }, []).map((campos, secaoIdx) => (
          <div key={secaoIdx}>
            <h1 className='text-2xl' style={{ color: '#5F84A1' }}>{titulosSecoes[secaoIdx]}</h1>
            <hr style={{ borderTop: '2px solid #A9A9A9', marginTop: '0.5em', marginBottom: '1em', width: '20%' }} />
            {campos.map((linha, linhaIdx) => (
              <div className="md:flex" key={linhaIdx}>
                {linha.map((campo, campoIdx) => (
                  <div className="flex-grow mb-2 me-2 w-full" key={campoIdx}>
                    {renderCampos([campo])}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <div className='flex justify-end'>
          {estrutura != null && estrutura.cadastro.acoes.map((botao, index) => (
            <button 
              key={index}
              type={botao.tipo === 'submit' ? 'submit' : 'button'}
              className='bg-gray-100 me-2 border rounded px-2 py-1'
              onClick={botao.tipo !== 'submit' ? () => chamarFuncao(botao.chave, botao) : undefined} 
            >
              {botao.nome}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default CadastroComSecoes;
