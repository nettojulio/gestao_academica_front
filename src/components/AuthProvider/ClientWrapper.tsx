"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import Interno from "@/components/Layout/Interno/Interno";
import Externo from "@/components/Layout/Externo/Externo";
interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(pathname === "/login" || pathname ==="/conta/criar-conta" || pathname ==="/conta/recuperar-senha" ); // Apenas a tela de login renderiza children diretamente
  }, [pathname]);

  // 🔹 Se for a página de login, exibe apenas o children.
  // 🔹 Caso contrário, exibe o layout Interno.
  return isLogin ? <Externo>{children}</Externo> : <Interno>{children}</Interno>;
}
