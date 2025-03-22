"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

// Ícones do MUI
import MenuIcon from "@mui/icons-material/Menu";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccountBalance, Calculate, Description, ShoppingCart } from "@mui/icons-material";

interface HeaderLandingProps {
  backgroundImage?: string;
  height?: string;
}

export default function HeaderLanding({
  backgroundImage,
  height = "400px",
}: HeaderLandingProps) {
  // Cria um estilo para o background, encapsulando o valor se necessário.
  const bgStyle = {
    backgroundImage: backgroundImage
      ? backgroundImage.includes("url(")
        ? backgroundImage
        : `url(${backgroundImage})`
      : undefined,
    height,
  };

  // Usamos o valor da prop 'height' (ou o padrão) para posicionar o Mega Menu.
  const headerHeight = "80px";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleMegaMenuEnter = () => setIsMegaMenuOpen(true);
  const handleMegaMenuLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsMegaMenuOpen(false);
    }
  };

  // Fecha o Mega Menu ao rolar a página
  useEffect(() => {
    const handleScroll = () => {
      if (isMegaMenuOpen) {
        setIsMegaMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMegaMenuOpen]);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Nossos Sistemas", href: "#", isMegaMenu: true },
    { label: "Contato", href: "/contato" },
    { label: "Área do Cliente", href: "/acesso", icon: <LockOpenIcon className="mr-1" /> },
  ];

  const megaMenuItems = [
    [
      {
        label: "Tributação Pública",
        icon: <AccountBalance className="text-primary-500 text-3xl" />,
        href: "/tributacao",
      },
      {
        label: "Nota Fiscal Eletrônica",
        icon: <Description className="text-primary-500 text-3xl" />,
        href: "/nota-fiscal",
      },
    ],
    [
      {
        label: "Gestão de Compras",
        icon: <ShoppingCart className="text-primary-500 text-3xl" />,
        href: "/compras",
      },
      {
        label: "Contabilidade Pública",
        icon: <Calculate className="text-primary-500 text-3xl" />,
        href: "/contabilidade",
      },
    ],
  ];

  return (
    <>
      <header className="relative w-full bg-cover bg-center" style={bgStyle}>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a href="/" title="WS Consultoria Pública">
              <Image src="/assets/crosshairs-gps.png" alt="WS Consultoria" width={45} height={45} />
            </a>
            <h1 className="text-lg font-bold text-white">
              WS <span className="text-primary-500">Consultoria</span>
            </h1>
          </div>

          {/* Botão do menu mobile */}
          <button onClick={toggleMenu} className="text-white text-2xl md:hidden">
            <MenuIcon />
          </button>

          {/* Navegação para Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={item.isMegaMenu ? handleMegaMenuEnter : undefined}
              >
                {item.isMegaMenu ? (
                  <>
                    <button
                      className="text-lg font-semibold text-white hover:text-primary-500 transition flex items-center"
                      onMouseEnter={handleMegaMenuEnter}
                    >
                      {item.label}
                      <ExpandMoreIcon className="ml-1" />
                    </button>

                    {/* Mega Menu */}
                    {isMegaMenuOpen && (
                      <div
                        className="fixed left-1/2 top-[80px] transform -translate-x-1/2 w-full max-w-[90vw] md:max-w-5xl min-w-[350px] bg-white shadow-xl border-t p-6 sm:p-8 lg:p-10 rounded-lg transition-all duration-300 z-50 hidden md:block"
                        style={{ top: headerHeight, minHeight: "320px" }}
                        onMouseLeave={handleMegaMenuLeave}
                      >
                        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Card lateral */}
                          <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center transition-transform duration-300 hover:scale-105">
                            <div className="flex items-center justify-center mb-6">
                              <Image src="/assets/crosshairs-gps.png" alt="Ícone ERP Gestão Pública" width={80} height={80} />
                            </div>
                            <p className="text-sm uppercase font-bold text-primary-600 tracking-wide">
                              ( Sistemas )
                            </p>
                            <h3 className="text-xl font-bold mt-2 text-center">
                              Gestão Pública
                            </h3>
                            <a
                              href="/nossos-sistemas"
                              className="mt-4 text-primary-500 font-semibold hover:underline"
                            >
                              Ver Todas as Soluções
                            </a>
                          </div>

                          {/* Itens do menu organizados em 2 colunas responsivas */}
                          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {megaMenuItems.map((column, colIndex) => (
                              <div key={colIndex} className="space-y-4">
                                {column.map((service, serviceIndex) => (
                                  <div
                                    key={serviceIndex}
                                    className="flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-100"
                                  >
                                    <div className="text-3xl transition-all duration-300">
                                      {service.icon}
                                    </div>
                                    <div className="flex flex-col transition-all duration-300">
                                      <span className="font-bold text-lg text-gray-800 hover:text-primary-500">
                                        {service.label}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="text-lg font-semibold text-white hover:text-primary-500 transition"
                  >
                    {item.icon && item.icon}
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Menu Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 z-30 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <span className="text-lg font-bold">Menu</span>
          <button onClick={toggleMenu} className="focus:outline-none">
            <CloseIcon className="text-gray-700" />
          </button>
        </div>
        <ul className="p-4 space-y-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="flex items-center text-lg text-gray-900 hover:text-primary-500 transition"
                onClick={toggleMenu}
              >
                {item.icon && item.icon}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
