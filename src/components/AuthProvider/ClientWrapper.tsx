"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import Interno from "@/components/Layout/Interno/Interno";
import Externo from "@/components/Layout/Externo/Externo";
import { InternalLayoutConfig } from "@/types/InternalLayoutConf";
interface ClientWrapperProps {
  children: ReactNode;
  layoutConfig?: InternalLayoutConfig;
}
export default function ClientWrapper({ children, layoutConfig }: ClientWrapperProps) {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(pathname === "/login" || pathname ==="/conta/criar-conta" || pathname ==="/conta/recuperar-senha" || pathname ==="/home" ); // Apenas a tela de login renderiza children diretamente
  }, [pathname]);

  // 🔹 Se for a página de login, exibe apenas o children.
  // 🔹 Caso contrário, exibe o layout Interno.
  return isLogin ? <Externo>{children}</Externo> : <Interno layoutConfig={layoutConfig!}>{children}</Interno>;
}
