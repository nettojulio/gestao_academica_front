import React from "react";
import { Metadata } from "next";
import ClientWrapper from "@/components/AuthProvider/ClientWrapper";
import { School, PendingActions, Groups2, AccountCircleOutlined } from "@mui/icons-material";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";


export const metadata: Metadata = {
  title: "Gestão de Acesso",
  description: "Modulo de Gestão de Acesso",
  icons: {
    icon: "/assets/crosshairs-gps.png",
  },
};



export default function EfrotasLayout({ children }: { children: React.ReactNode }) {
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
      title: "Gestão de Acesso",
      userActions: [
        {
          label: "Minha conta",
          route: "/conta/perfil",
          icon: <AccountCircleOutlined fontSize="small" />,
        },
        {
          label: "Sair",
          route: "/conta/sair",
          icon: <PendingActions fontSize="small" />,
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
          label: "Cursos",
          route: "/auth/cursos",
          icon: <School fontSize="small" />,
          roles: ["admin"],
        },
        {
          label: "Solicitações",
          route: "/auth/solicitacoes",
          icon: <PendingActions fontSize="small" />,
          roles: ["admin", "gestor", "tecnico"],
          // Exemplo de submenu:
          subItems: [
            {
              label: "Aguardando",
              route: "/auth/solicitacoes/aguardando",
              icon: <PendingActions fontSize="small" />,
            },
            {
              label: "Aprovadas",
              route: "/auth/solicitacoes/aprovadas",
              icon: <PendingActions fontSize="small" />,
            },
          ],
        },
        {
          label: "Usuários",
          route: "/auth/usuarios",
          icon: <Groups2 fontSize="small" />,
          roles: ["admin"],
        },
      ],
    },
  };
  return (
    <ClientWrapper layoutConfig={layoutConfig}>{children}</ClientWrapper>
  )
}
