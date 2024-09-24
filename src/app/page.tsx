"use client";

import Card from "@/components/CardDefault";
import style from "./page.module.scss";
import { useState, useEffect } from "react";
import { getStorageItem } from "@/utils/localStore";
import { useRouter } from "next/navigation"; // Importação necessária se usar router em InicioPage
import Login from "@/components/Login";

export default function InicioPage() {
  const [role, setRole] = useState(null); // Inicializa como null
  const router = useRouter(); // Se precisar usar router

  useEffect(() => {
    const storedRole = getStorageItem("userRole");
    setRole(storedRole);
  }, []);

  function whatIsTypeUser() {
  

    if (role === "ROLE_ADMIN") {
      return <LayoutPublic />;
    } else if (role === "ROLE_ESTUDANTE") {
      return <LayoutCoordenador />;
    } else if (role === "ROLE_AGRICULTOR") {
      return <LayoutAgricultor />;
    } else {
      return < LayoutAdmin/>;
    }
  }

  return (

      <div className={style.menu}>
        <div className={style.conjuntoCards}>
          {whatIsTypeUser()}
        </div>
      </div>
  );
}

const LayoutAdmin = () => {
  return (
    <>
      <Card title="Agricultores" icon="/assets/iconAgricultor.svg" description="Agricultores" link="/agricultores" />
      <Card title="Coordenadores" icon="/assets/IconCordenadores.svg" description="Coordenadores" link="/coordenadores" />
      <Card title="Funcionários" icon="/assets/iconAssociates.svg" description="Funcionários" link="/funcionarios" />
      <Card title="Bancos de Sementes" icon="/assets/iconBancoDeSementes.svg" description="Banco Sementes" link="/bancoSementes" />
      <Card title="Gestão de Sementes" icon="/assets/iconSeedGreen.svg" description="Sementes" link="/sementes" />
      <Card title="Mural" icon="/assets/iconMural.svg" description="Mural" link="/mural" />
    </>
  );
};

const LayoutCoordenador = () => {
  return (
    <>
      <Card title="Agricultores" icon="/assets/iconAgricultor.svg" description="Agricultores" link="/agricultores" />
      <Card title="Bancos de Sementes" icon="/assets/iconBancoDeSementes.svg" description="Banco Sementes" link="/bancoSementes" />
      <Card title="Doações de Sementes" icon="/assets/iconDoacaoDeSementes.svg" description="Doações Sementes" link="/doacoes" />
      <Card title="Retirada de Sementes" icon="/assets/iconRetiradaDeSementes.svg" description="Doações Sementes" link="/retiradas" />
      <Card title="Gestão de Sementes" icon="/assets/iconSeedGreen.svg" description="Sementes" link="/sementes" />
      <Card title="Mural" icon="/assets/iconMural.svg" description="Mural" link="/mural" />
    </>
  );
};

const LayoutAgricultor = () => {
  return (
    <>
      <Card title="Bancos de Sementes" icon="/assets/iconBancoDeSementes.svg" description="Banco Sementes" link="/bancoSementes" />
      <Card title="Sementes" icon="/assets/iconSeedGreen.svg" description="Sementes" link="/sementes" />
      <Card title="Histórico de Doações" icon="/assets/iconMovimentacaoBancoSementes.svg" description="Doações Sementes" link="/doacoes" />
      <Card title="Histórico de Retirada" icon="/assets/iconMovimentacaoBancoSementes.svg" description="Doações Sementes" link="/retiradas" />
      <Card title="Mural" icon="/assets/iconMural.svg" description="Mural" link="/mural" />
    </>
  );
};

const LayoutPublic = () => {
  return (
    <div className={style.container} >
      {/** Adicionar o conteudo de texto */}
      <Login />
      <Login />
    </div>
  );
};
