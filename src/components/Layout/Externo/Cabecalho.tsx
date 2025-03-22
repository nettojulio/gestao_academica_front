import React from 'react';
import Link from 'next/link';
import theme from "@/theme/theme";

const Cabecalho = ({ dados }: any) => {
  return (
    <header className="bg-white shadow-md border-b border-neutrals-300 px-8 py-4 flex justify-between items-center relative z-10">
    <div className="text-primary-500 text-xl font-bold">Logo</div>
    <nav className="flex gap-6 text-primary-500 font-semibold">
      <Link href="/" className="hover:text-primary-700 transition">Home</Link>
      <Link href="#" className="hover:text-primary-700 transition">Sistema</Link>
    </nav>
  </header>

  );
};

export default Cabecalho;
