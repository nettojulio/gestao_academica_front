// Com filtragem

import { useState, useEffect } from "react";

const EditableCombobox = ({ field, value, onChange }: any) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] = useState([] as any);

  useEffect(() => {
    if (value) {
      const newFilteredOptions = field.selectOptions.filter((option: any) =>
        option.valor.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(newFilteredOptions);
    } else {
      setFilteredOptions(field.selectOptions);
    }
  }, [value, field.selectOptions]);

  const handleInputChange = (event: any) => {
    const inputValue = event.target.value;
    onChange(inputValue);
  };

  const handleOptionClick = (optionValue: any) => {
    onChange(optionValue);
    setShowOptions(false);
  };

  return (
    <div className="relative">
      <label htmlFor={field.chave} className="block text-gray-700 uppercase">
        {field.nome}
        <samp className="text-red-500 ml-1" hidden={!field.obrigatorio}>
          *
        </samp>
      </label>
      <input
        id={field.chave}
        name={field.chave}
        className="mt-1 p-2 w-full border rounded-md bg-white"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 200)}
        required={field.obrigatorio}
        disabled={field.bloqueado}
      />
      {showOptions && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map((option: any, index: any) => (
            <li
              key={index}
              className="cursor-pointer hover:bg-gray-100 px-4 py-2"
              onClick={() => handleOptionClick(option.valor)}
            >
              {option.valor}
            </li>
          ))}
        </ul>
      )}
      {/* {showOptions && filteredOptions.length === 0 && (
        <p className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg px-4 py-2 text-gray-500">
          Nenhuma opção encontrada
        </p>
      )} */}
    </div>
  );
};

export default EditableCombobox;
