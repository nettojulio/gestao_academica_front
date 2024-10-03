"use client"

import { useState } from "react";
import Select from "../Select/page";
import style from "./solicitarPerfil.module.scss";

const SolicitarPerfil = ({}) => {
  const [perfilPretendido, setPerfilPretendido] = useState(''); 

  const opcoes = [
    { value: 'gestor', label: 'Gestor' },
    { value: 'professor', label: 'Professor' },
    { value: 'tecnico', label: 'Técnico' },
    { value: 'aluno', label: 'Aluno' },
  ]

  const handleChange = (value: string) => {
    setPerfilPretendido(value);
  };

    return (
      <>
      <h2 className={style.titulo}>Solicitar perfil</h2>
      <form className={style.formContainer}>
        <Select type="form" label="Perfil pretendido" options={opcoes} onChange={handleChange}/>
      </form>
      {/* <label >Perfil pretendido</label>
      <select>
        <option value="gestor">Gestor</option>
        <option value="professor">Professor</option>
        <option value="aluno">Aluno</option>
      </select> */}

    </>
    );
}

export default SolicitarPerfil;
