// types/InternalLayoutConfig.ts
import { ReactNode } from "react";

export interface HeaderConfig {
  // Configuração do cabeçalho
  logo: {
    url: string;           // URL da imagem do logo
    width?: number;        // Largura em pixels
    height?: number;       // Altura em pixels
    alt?: string;          // Texto alternativo
    position?: "left" | "center" | "right"; // Posição da logo
  };
  title: string;           // Título do sistema ou módulo
  userActions?: Array<{
    label: string;
    route: string;
    icon: ReactNode;
  }>;
}

export interface MenuItem {
  // Cada item de menu
  label: string;
  route: string;
  icon: ReactNode;
  roles?: string[];       // (Opcional) Papéis que podem ver esse item
  subItems?: MenuItem[];  // (Opcional) Itens aninhados para submenu
}

export interface SidebarConfig {
  // Configuração do menu lateral (sidebar)
  logo: {
    url: string;          // URL da logo do sidebar
    width?: number;
    height?: number;
    text?: string;        // Texto que acompanha a logo
  };
  menuItems: MenuItem[];  // Lista de itens de menu
}

export interface InternalLayoutConfig {
  // Configuração completa do layout interno
  header: HeaderConfig;
  sidebar: SidebarConfig;
  // Outras partes (como footer ou configurações de conteúdo) podem ser adicionadas aqui
}
