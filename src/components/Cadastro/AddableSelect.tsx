import React, { useState, useEffect } from 'react';

interface AddableSelectProps 
{
    dadosForm?: any; 
    campo?: any;     
    setDadosForm?: (value: any) => void; 
    chamarFuncao?: () => void;  
}

const AddableSelect: React.FC<AddableSelectProps> = ({
    dadosForm = null,
    campo = null,
    setDadosForm = null,
    chamarFuncao = null,
}: any) => {

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => 
    {
        const value = e.target.value;

        if (value === 'add-new') 
            campo.setIsAddingNewTipo(true);
        else 
        {
            campo.setIsAddingNewTipo(false);

            setDadosForm && setDadosForm((prevState: any) => ({
                ...prevState,
                [campo.chave]: value,
            }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => 
    {
        const { name, value } = e.target;
        campo.setNovoValor((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleCancelAddNew = () => 
    {
        campo.setIsAddingNewTipo(false);
        campo.setNovoValor({ codigo: '', nome: '' });
    };

    return (
        <div>
            <label htmlFor={campo.chave} className="block text-gray-700 uppercase">
              {campo.nome}
              <samp className='text-red-500 ml-1' hidden={!campo.obrigatorio}>*</samp>
            </label>
            {!campo.isAddingNewTipo ? (
                <select
                    id={campo.chave}
                    name={campo.chave}
                    className="mt-1 p-2 w-full border rounded-md bg-white"
                    value={dadosForm && dadosForm[campo.chave] || ''}
                    onChange={handleSelectChange}
                    disabled={campo.bloqueado}
                    required={campo.obrigatorio}
                >
                    <option value="" disabled>Selecione</option>
                    
                    {campo.selectOptions && campo.selectOptions.map((option: any, optionIdx: any) => (
                        <option key={optionIdx} value={option.chave}>{option.valor}</option>
                    ))}

                    <option value="add-new">{campo.descricaoNovoTipo}</option>
                </select>
            ) : (
              <div className="flex items-center space-x-2">
                <input
                    type="text"
                    name="codigo"
                    className="mt-1 p-2 border rounded-md flex-grow-0 w-1/5"
                    placeholder="Código"
                    value={campo?.novoValor?.codigo || ''}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="nome"
                    className="mt-1 p-2 border rounded-md flex-grow"
                    placeholder="Nome"
                    value={campo?.novoValor?.nome || ''}
                    onChange={handleInputChange}
                />
                <button
                    type="button"
                    className="mt-1 p-2 border rounded-md"
                    onClick={handleCancelAddNew}
                >
                    Cancelar
                </button>
            </div>
          )}
        </div>
    );
};

export default AddableSelect;
