"use client";
import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cabecalho from "./Cabecalho";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function LayoutExterno({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-neutrals-50 text-neutrals-900">
      {/* HEADER */}
      <header className="bg-white shadow">
        <Cabecalho />
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutrals-300">
        <Footer />
      </footer>
    </div>
  );
}
