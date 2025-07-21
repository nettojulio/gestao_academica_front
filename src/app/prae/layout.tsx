'use client';

import React from "react";
import ClientWrapper from "@/components/AuthProvider/ClientWrapper";
import AuthTokenService from "../authentication/auth.token"; // ajuste o path se necessário
import {
  School, PendingActions, Groups2, AccountCircleOutlined,
  CalendarMonth, EventNote, Schedule, Payment, VolunteerActivism,
  AccountBalance, Diversity3, Home, BusinessCenter
} from "@mui/icons-material";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";

export default function PraeLayout({ children }: { children: React.ReactNode }) {
  const isAluno = AuthTokenService.isAluno(false); // <- obtém se é aluno

  const layoutConfig: InternalLayoutConfig = {
    header: {
      logo: {
        url: "/assets/logo-auth.png",
        width: 40,
        height: 40,
        alt: "Logo Auth",
        position: "left",
      },
      title: "PRAE",
      userActions: [
        {
          label: "Minha conta",
          route: "/conta/perfil",
          icon: <AccountCircleOutlined fontSize="small" className="text-white" />,
        },
        {
          label: "Sair",
          route: "/conta/sair",
          icon: <PendingActions fontSize="small" className="text-white" />,
        },
      ],
    },
    sidebar: {
      logo: {
        url: "/assets/logo-sidebar.png",
        width: 32,
        height: 32,
        text: "SGU",
      },
      menuItems: [
        {
          label: "Início",
          route: "/home",
          icon: <Home fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico", "aluno"],
        },
        {
          label: "Gerenciar Estudantes",
          route: "/prae/estudantes",
          icon: <School fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
        },
        {
          label: "Meu Cadastro",
          route: "/prae/estudantes/atual",
          icon: <School fontSize="small" className="text-white" />,
          roles: ["aluno"],
        },
        {
          label: "Gerenciar Benefícios",
          route: "/prae/beneficios",
          icon: <VolunteerActivism fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor"],
          subItems: [
            {
              label: "Tipos",
              route: "/prae/beneficios/tipos",
              icon: <VolunteerActivism fontSize="small" className="text-white" />,
            },
            {
              label: "Benefícios",
              route: "/prae/beneficios/beneficios",
              icon: <VolunteerActivism fontSize="small" className="text-white" />,
            },
          ],
        },
        {
          label: isAluno ? "Pagamentos" : "Gerenciar Pagamentos",
          route: "/prae/pagamentos",
          icon: <Payment fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "aluno"],
          subItems: [
            {
              label: "Pagamentos Pendentes",
              route: "/prae/pagamentos/pagamentos-pendentes",
              icon: <Payment fontSize="small" className="text-white" />,
              roles: ["administrador", "gestor"],
            },
            {
              label: "Pagamentos Realizados",
              route: "/prae/pagamentos/pagamentos-realizados",
              icon: <Payment fontSize="small" className="text-white" />,
              roles: ["administrador", "gestor"],
            },
            {
              label: "Meus Recebimentos",
              route: "/prae/pagamentos/meus-recebimentos",
              icon: <Payment fontSize="small" className="text-white" />,
              roles: ["aluno"],
            },
          ]
        },
        {
          label: isAluno ? "Agendamentos" : "Gerenciar Agendamentos",
          route: "/prae/agendamentos",
          icon: <EventNote fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "aluno"],
          subItems: [
            {
              label: "Tipo de Atendimento",
              route: "/prae/agendamentos/tipo",
              icon: <Schedule fontSize="small" className="text-white" />,
              roles: ["administrador"],
            },
            {
              label: "Gerenciar Cronograma",
              route: "/prae/agendamentos/cronograma",
              icon: <EventNote fontSize="small" className="text-white" />,
              roles: ["administrador", "gestor"],
            },
            {
              label: "Calendário de Agendamentos",
              route: "/prae/agendamentos/calendario",
              icon: <CalendarMonth fontSize="small" className="text-white" />,
              roles: ["administrador", "gestor", "aluno"],
            },
            {
              label: "Meus Agendamentos",
              route: "/prae/agendamentos/calendario/meus-agendamentos",
              icon: <EventNote fontSize="small" className="text-white" />,
              roles: ["administrador", "gestor", "aluno"],
            },
            {
              label: "Meus Cancelamentos",
              route: "/prae/agendamentos/calendario/meus-cancelamentos",
              icon: <EventNote fontSize="small" className="text-white" />,
              roles: ["administrador", "gestor", "aluno"],
            },
          ],
        },
      ],
    },
  };

  return <ClientWrapper layoutConfig={layoutConfig}>{children}</ClientWrapper>;
}
