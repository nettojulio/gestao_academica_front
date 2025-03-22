import React, { useState, useEffect } from 'react';
import { generica } from '@/utils/apiUpload';
import { toast } from 'react-toastify';

const CadastroImportacao = ({ estrutura = null, dadosPreenchidos = {}, setDadosPreenchidos = null, chamarFuncao = null }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  useEffect(() => {
    setDadosPreenchidos && setDadosPreenchidos(dadosPreenchidos);
  }, [dadosPreenchidos, setDadosPreenchidos]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data: any = {};
    const parametros = {};

    formData.forEach((value, key) => {
      if (key.startsWith('parametros.')) {
        const paramKey = key.split('.')[1];
        parametros[paramKey] = value;
      } else {
        data[key] = value;
      }
    });

    Object.keys(dadosPreenchidos).forEach((key) => {
      if (key.startsWith('parametros.')) {
        const paramKey = key.split('.')[1];
        parametros[paramKey] = dadosPreenchidos[key];
      } else {
        data[key] = dadosPreenchidos[key];
      }
    });

    data.parametros = parametros;
    console.log('data', data);
    chamarFuncao('salvar', data);
  };

  const alterarInput = (event) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const alterarSelect = (event) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Verifica se a opção selecionada tem valores padrão associados
      estrutura.cadastro.campos.forEach((campoGroup) => {
        campoGroup.forEach((campo) => {
          if (campo.tipo === 'select' && campo.selectOptions) {
            const selectedOption = campo.selectOptions.find((option) => option.chave === value);
            if (selectedOption?.valorDefault) {
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
    setDadosPreenchidos((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const alterarArquivo = async (event) => {
    const { name, files } = event.target;
    if (files.length === 0) return;

    setLoading(true);
    setUploadComplete(false);

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('dir', 'importador');

    const body = {
      metodo: 'post',
      uri: '/upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    try {
      const response = await generica(body);

      if (response.data.errors) {
        toast('Erro. Tente novamente!', { position: 'bottom-left' });
      } else if (response.data.error) {
        toast(response.data.error.message, { position: 'bottom-left' });
      } else {
        console.log('Arquivo enviado:', name, response.data);
        setDadosPreenchidos((prevData) => ({
          ...prevData,
          [name]: response.data,
        }));
        setUploadComplete(true);
      }
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error);
      toast('Erro ao enviar o arquivo. Tente novamente!', { position: 'bottom-left' });
    } finally {
      setLoading(false);
    }
  };

  const isConditionMet = (condicoes) => {
    if (!condicoes) return true;
    if (!Array.isArray(condicoes)) condicoes = [condicoes];
    return condicoes.some((condicao) => dadosPreenchidos[condicao.campo] === condicao.valor);
  };

  const isConditionExclusivaMet = (condicoes) => {
    if (!condicoes) return true;
    if (!Array.isArray(condicoes)) condicoes = [condicoes];
    return condicoes.every((condicao) => dadosPreenchidos[condicao.campo] === condicao.valor);
  };

  const handleDownload = (caminho, nome) => {
    const link = document.createElement('a');
    link.href = caminho;
    link.download = nome;
    console.log('link', link);

    link.click();
  };

  return (
    <div>
      <form className="w-full pt-2 pb-2" onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={dadosPreenchidos?.id || ''} />
        <input type="hidden" name="versao" value="V1" />
        {estrutura != null && estrutura.cadastro.campos.map((elemento, index) => (
          <div className="md:flex" key={index}>
            {elemento.map((e, idx) => (
              isConditionMet(e.condicao) && isConditionExclusivaMet(e.condicaoExclusiva) && (
                <div className="flex-grow mb-2 me-2 w-full" key={idx} hidden={e.oculto}>
                  {e.tipo === 'text' && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                        <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                      </label>
                      <input
                        type="text"
                        id={e.chave}
                        name={e.chave}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder={e.mensagem}
                        value={dadosPreenchidos[e.chave] || ''}
                        onChange={alterarInput}
                        disabled={e.bloqueado}
                        required={e.obrigatorio}
                      />
                    </>
                  )}
                  {e.tipo === 'number' && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                        <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                      </label>
                      <input
                        type="number"
                        id={e.chave}
                        name={e.chave}
                        className="mt-1 p-2 w-full border rounded-md"
                        placeholder={e.mensagem}
                        value={dadosPreenchidos[e.chave] || ''}
                        onChange={alterarInput}
                        disabled={e.bloqueado}
                        required={e.obrigatorio}
                      />
                    </>
                  )}
                  {e.tipo === 'select' && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                        <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                      </label>
                      <select
                        id={e.chave}
                        name={e.chave}
                        className="mt-1 p-2 w-full border rounded-md bg-white"
                        value={dadosPreenchidos[e.chave] || ''}
                        onChange={alterarSelect}
                        disabled={e.bloqueado}
                        required={e.obrigatorio}
                      >
                        <option value="" disabled>Selecione</option>
                        {e.selectOptions && e.selectOptions.map((option, optionIdx) => (
                          isConditionMet(option.condicao) && isConditionExclusivaMet(option.condicao) && (
                            <option key={optionIdx} value={option.chave}>{option.valor}</option>
                          )
                        ))}
                      </select>
                    </>
                  )}
                  {e.tipo === 'boolean' && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                        <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                      </label>
                      <input
                        type="checkbox"
                        id={e.chave}
                        name={e.chave}
                        className="mt-1 p-2 w-full border rounded-md"
                        checked={dadosPreenchidos[e.chave] || false}
                        onChange={alterarCheckbox}
                        disabled={e.bloqueado}
                        required={e.obrigatorio}
                      />
                    </>
                  )}
                  {e.tipo === 'date' && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                        <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                      </label>
                      <input
                        type="date"
                        id={e.chave}
                        name={e.chave}
                        className="mt-1 p-2 w-full border rounded-md"
                        checked={dadosPreenchidos[e.chave] || false}
                        onChange={alterarCheckbox}
                        disabled={e.bloqueado}
                        required={e.obrigatorio}
                      />
                    </>
                  )}
                  {e.tipo === 'file' && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                        <samp className='text-red-500 ml-1' hidden={!e.obrigatorio}>*</samp>
                      </label>
                      <div className="flex items-center">
                        <input
                          type="file"
                          id={e.chave}
                          name={e.chave}
                          className="mt-1 p-2 w-full border rounded-md"
                          onChange={alterarArquivo}
                          disabled={e.bloqueado}
                          required={e.obrigatorio}
                          accept={dadosPreenchidos['formatoArquivo'] === 'arq_geojson' ? '.json' : '.csv'}
                        />
                        {loading && (
                          <div className="ml-2  animate-spin  w-8 h-8 border-4 rounded-full border-t-gray-900 border-gray-500"></div>
                        )}
                      </div>
                    </>
                  )}
                  {e.tipo === 'download' && (
                    <>
                      <label htmlFor={e.chave} className="block text-gray-700 uppercase">
                        {e.nome}
                      </label>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDownload(e.caminho, e.nomeArquivo || 'modelo.csv')}
                      >
                        Download
                      </button>
                    </>
                  )}
                  {e.tipo !== 'text' && e.tipo !== 'select' && e.tipo !== 'boolean' && (
                    <div className="mt-1 p-2 w-full"></div>
                  )}
                </div>
              )
            ))}
          </div>
        ))}
        <div className='flex justify-end'>
          {estrutura != null && estrutura.cadastro.acoes.map((botao, index) => (
            botao.tipo === 'submit' ? (
              <button
                key={index}
                type='submit'
                className={`bg-gray-100 me-2 border rounded px-2 py-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading }
              >
                {botao.nome}
              </button>
            ) : (
              <button
                key={index}
                type='button'
                className='bg-gray-100 me-2 border rounded px-2 py-1'
                onClick={() => chamarFuncao(botao.chave, botao)}
              >
                {botao.nome}
              </button>
            )
          ))}
        </div>
      </form>
    </div>
  );
};

export default CadastroImportacao;
