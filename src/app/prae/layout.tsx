import React from "react";
import { Metadata } from "next";
import ClientWrapper from "@/components/AuthProvider/ClientWrapper";
import { School, PendingActions, Groups2, AccountCircleOutlined, CalendarMonth, EventNote, Schedule, Payment, VolunteerActivism, AccountBalance, Diversity3, Home, BusinessCenter } from "@mui/icons-material";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";


export const metadata: Metadata = {
  title: "Gestão PRAE",
  description: "Modulo de Gestão de PRAE",
  icons: {
    icon: "/assets/crosshairs-gps.png",
  },
};



export default function PraeLayout({ children }: { children: React.ReactNode }) {
  // config/authLayoutConfig.tsx

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
          roles: ["administrador", "gestor", "tecnico"],
        },
        {
          label: "Tipo de Etnia",
          route: "/prae/etnia",
          icon: <Diversity3 fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
        },
        {
          label: "Estudantes",
          route: "/prae/estudantes",
          icon: <School fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico", "aluno"],
        },
        {
          label: "Dados Bancários",
          route: "/prae/dados-bancarios",
          icon: <AccountBalance fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
        },
        {
          label: "Auxílios",
          route: "/prae/auxilio",
          icon: <VolunteerActivism fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor"],
          subItems: [
            {
              label: "Tipos",
              route: "/prae/auxilio/tipo",
              icon: <VolunteerActivism fontSize="small" className="text-white" />,
            },
            {
              label: "Auxílio",
              route: "/prae/auxilio/auxilios",
              icon: <VolunteerActivism fontSize="small" className="text-white" />,
            },
          ],
        },
        {
          label: "Pagamentos",
          route: "/prae/pagamentos",
          icon: <Payment fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor"],
        },
        {
          label: "Agendamentos",
          route: "/prae/agendamentos",
          icon: <EventNote fontSize="small" className="text-white" />,
          roles: ["administrador", "gestor", "tecnico"],
          subItems: [
            {
              label: "Tipo de Atendimento",
              route: "/prae/agendamentos/tipo",
              icon: <Schedule fontSize="small" className="text-white" />,
            },
            {
              label: "Cronograma",
              route: "/prae/agendamentos/cronograma",
              icon: <EventNote fontSize="small" className="text-white" />,
            },
            {
              label: "Calendário",
              route: "/prae/agendamentos/calendario",
              icon: <CalendarMonth fontSize="small" className="text-white" />,
            },
          ],
        },
        {
          label: "Calendário",
          route: "/prae/agendamentos/calendario",
          icon: <CalendarMonth fontSize="small" className="text-white" />,
          roles: ["administrador", "aluno", "estudante"],
        },


      ],
    },
  };
  return (
    <ClientWrapper layoutConfig={layoutConfig}>{children}</ClientWrapper>
  )
}
