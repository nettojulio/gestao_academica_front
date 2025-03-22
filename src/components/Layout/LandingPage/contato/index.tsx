"use client";

import Image from "next/image";
import React from "react";

interface ContatoProps {
  tituloSecao?: string;
  subtituloSecao?: string;
  link?: string;
  imagemSecao?: string;

  tituloSecao1?: string;
  subtituloSecao1?: string;
  link1?: string;
  imagemSecao1?: string;
}

const LayoutContato: React.FC<ContatoProps> = ({
  tituloSecao,
  subtituloSecao,
  link,
  imagemSecao,
  tituloSecao1,
  subtituloSecao1,
  link1,
  imagemSecao1,
}) => {
  return (
    <>
      {/* Section 1: Texto à esquerda, imagem à direita */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Texto */}
          <div className="md:w-1/2 px-4 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800">
              {tituloSecao ?? "Cotação"}
            </h2>
            <p className="mt-4 text-gray-600">
              {subtituloSecao ??
                "Precisa de uma cotação? Então entre em contato e teremos prazer em ajudá-lo!"}
            </p>
            <a
              href={link ?? "#"}
              className="mt-6 inline-block px-6 py-2 bg-primary-500 text-white font-semibold text-title-medium rounded hover:bg-primary-700 transition"
            >
              Ler Mais
            </a>
          </div>

          {/* Imagem (à direita) */}
          <div className="md:w-1/2 px-4">
            {imagemSecao && (
              <img
                src={imagemSecao}
                alt="Cotação"
                className="w-full max-w-lg object-cover rounded-lg shadow-lg mx-auto"
              />
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Imagem à esquerda, texto à direita */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Imagem (à esquerda) */}
          <div className="md:w-1/2 px-4 mb-8 md:mb-0 md:order-1">
            {imagemSecao1 && (
              <img
                src={imagemSecao1}
                alt="Fale Conosco"
                className="w-full max-w-lg object-cover rounded-lg shadow-lg mx-auto"
              />
            )}
          </div>

          {/* Texto (à direita) */}
          <div className="md:w-1/2 px-4 md:order-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {tituloSecao1 ?? "Fale Conosco"}
            </h2>
            <p className="mt-4 text-gray-600">
              {subtituloSecao1 ??
                "Tem alguma dúvida ou sugestão? Entre em contato conosco!"}
            </p>
            <a
              href={link1 ?? "#"}
              className="mt-6 inline-block px-6 py-2 bg-primary-500 text-white font-semibold text-title-medium rounded hover:bg-primary-700 transition"
            >
              Ler Mais
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default LayoutContato;
