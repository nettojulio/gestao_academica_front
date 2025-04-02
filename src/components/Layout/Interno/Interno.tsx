"use client";
import React, { ReactNode, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider/AuthProvider";

// Ícones do Material‑UI
import MenuIcon from "@mui/icons-material/Menu";
import MapIcon from "@mui/icons-material/Map";
import BarChartIcon from "@mui/icons-material/BarChart";
import BuildIcon from "@mui/icons-material/Build";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SettingsIcon from "@mui/icons-material/Settings";
import GridViewIcon from "@mui/icons-material/GridView";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import HistoryIcon from "@mui/icons-material/History";
import LockIcon from "@mui/icons-material/Lock";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Image from "next/image";
import { AccountBalanceOutlined, AccountCircleOutlined, AdminPanelSettingsOutlined, BadgeOutlined, CastForEducation, DocumentScannerOutlined, GasMeterOutlined, GpsFixed, GroupAddOutlined, Groups2, HailOutlined, HelpOutline, HomeOutlined, LanOutlined, LocalConvenienceStoreOutlined, LocalGasStationOutlined, ManageAccounts, ManageHistoryOutlined, MenuOpen, NoCrashOutlined, PendingActions, PostAddOutlined, QueryBuilderSharp, QueryStatsOutlined, ReceiptLongOutlined, RequestPageOutlined, RoomOutlined, School, SettingsOutlined, TransferWithinAStationOutlined } from "@mui/icons-material";
import AuthTokenService from "@/app/authentication/auth.token";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState<boolean>(false);
  const [isSubMenuCadastroOpen, setIsSubMenuCadastroOpen] = useState<boolean>(false);
  const [isSubMenuLancamentoOpen, setIsSubMenuLancamentoOpen] = useState<boolean>(false);
  const [isSubMenuRelatorioOpen, setIsSubMenuRelatorioOpen] = useState<boolean>(false);
  const [isSubMenuConfigOpen, setIsSubMenuConfigOpen] = useState<boolean>(false);
  const [isSubMenuConfig1Open, setIsSubMenuConfig1Open] = useState<boolean>(false);
  const [isSubMenuConfig2Open, setIsSubMenuConfig2Open] = useState<boolean>(false);

  // Utilizando somente os perfis: administração, gestão e execução
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isGestor, setIsGestor] = useState<boolean>(false);
  const [isTecnico, setIsTecnico] = useState<boolean>(false);
  const [isProfessor, setIsProfessor] = useState<boolean>(false);
  const [isAluno, setIsAluno] = useState<boolean>(false);
  const [isVisitante, setIsVisitante] = useState<boolean>(false);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [usuarioLogado, setUsuarioLogado] = useState<string | null>(null);

  const [isPopupWindow, setIsPopupWindow] = useState<boolean>(false);

  useEffect(() => {
    const authenticated = AuthTokenService.isAuthenticated(false);
    setIsAuthenticated(authenticated);

    if (authenticated) {
      setIsAdmin(AuthTokenService.isAdmin(false));
      setIsGestor(AuthTokenService.isGestor(false));
      setIsTecnico(AuthTokenService.isTecnico(false));
      setIsProfessor(AuthTokenService.isProfessor(false));
      setIsAluno(AuthTokenService.isAluno(false));
      setIsVisitante(AuthTokenService.isVisitante(false));
      setUsuarioLogado(AuthTokenService.getUsuarioLogado(false));
    } else {
      setIsAdmin(false);
      setIsGestor(false);
      setIsTecnico(false);
      setIsProfessor(false);
      setIsAluno(false);
      setIsAluno(false);
      setUsuarioLogado(null);
    }
  }, [isAuthenticated, setIsAuthenticated]);

  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsMenuOpen(false);
    setIsSubMenuOpen(false);
    setIsSubMenuLancamentoOpen(false);
    setIsSubMenuCadastroOpen(false);
    setIsSubMenuRelatorioOpen(false);
    setIsSubMenuConfigOpen(false);
    setIsSubMenuConfig1Open(false);
    setIsSubMenuConfig2Open(false);
  };

  // Exemplo para o menu principal (caso queira fechar os submenus quando o menu principal for aberto)
  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        // Se o menu principal for aberto, fecha todos os submenus
        setIsSubMenuOpen(false);
        setIsSubMenuCadastroOpen(false);
        setIsSubMenuLancamentoOpen(false);
        setIsSubMenuRelatorioOpen(false);
        setIsSubMenuConfigOpen(false);
        setIsSubMenuConfig1Open(false);
        setIsSubMenuConfig2Open(false);
      }
      return newValue;
    });
    setWindowWidth(1000);
  };

  // Para o submenu genérico
  const handleToggleSubMenu = () => {
    setIsSubMenuOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        // Quando este submenu abrir, feche os demais
        setIsSubMenuCadastroOpen(false);
        setIsSubMenuLancamentoOpen(false);
        setIsSubMenuRelatorioOpen(false);
        setIsSubMenuConfigOpen(false);
        setIsSubMenuConfig1Open(false);
        setIsSubMenuConfig2Open(false);
      }
      return newValue;
    });
  };

  // Para o submenu de Cadastro
  const handleToggleSubMenuCadastro = () => {
    setIsSubMenuCadastroOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        setIsSubMenuOpen(false);
        setIsSubMenuLancamentoOpen(false);
        setIsSubMenuRelatorioOpen(false);
        setIsSubMenuConfigOpen(false);
        setIsSubMenuConfig1Open(false);
        setIsSubMenuConfig2Open(false);
      }
      return newValue;
    });
  };

  // Para o submenu de Lançamento
  const handleToggleSubMenuLancamento = () => {
    setIsSubMenuLancamentoOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        setIsSubMenuOpen(false);
        setIsSubMenuCadastroOpen(false);
        setIsSubMenuRelatorioOpen(false);
        setIsSubMenuConfigOpen(false);
        setIsSubMenuConfig1Open(false);
        setIsSubMenuConfig2Open(false);
      }
      return newValue;
    });
  };

  // Para o submenu de Relatório
  const handleToggleSubMenuRelatorio = () => {
    setIsSubMenuRelatorioOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        setIsSubMenuOpen(false);
        setIsSubMenuCadastroOpen(false);
        setIsSubMenuLancamentoOpen(false);
        setIsSubMenuConfigOpen(false);
        setIsSubMenuConfig1Open(false);
        setIsSubMenuConfig2Open(false);
      }
      return newValue;
    });
  };

  // Para o submenu de Configuração (pai)
  const handleToggleConfigMenu = () => {
    setIsSubMenuConfigOpen((prev) => {
      const newValue = !prev;
      if (newValue) {
        // Fecha os outros submenus
        setIsSubMenuOpen(false);
        setIsSubMenuCadastroOpen(false);
        setIsSubMenuLancamentoOpen(false);
        setIsSubMenuRelatorioOpen(false);
        setIsSubMenuConfig1Open(false);
        setIsSubMenuConfig2Open(false);
      }
      return newValue;
    });
  };

  // Para o submenu de Configuração 1 (filho)
  const handleToggleSubMenuConfig1 = () => {
    setIsSubMenuConfig1Open((prev) => {
      const newValue = !prev;
      if (newValue) {
        setIsSubMenuOpen(false);
        setIsSubMenuCadastroOpen(false);
        setIsSubMenuLancamentoOpen(false);
        setIsSubMenuRelatorioOpen(false);
        setIsSubMenuConfigOpen(false);
        setIsSubMenuConfig2Open(false);
      }
      return newValue;
    });
  };

  // Para o submenu de Configuração 2 (filho)
  const handleToggleSubMenuConfig2 = () => {
    setIsSubMenuConfig2Open((prev) => {
      const newValue = !prev;
      if (newValue) {
        setIsSubMenuOpen(false);
        setIsSubMenuCadastroOpen(false);
        setIsSubMenuLancamentoOpen(false);
        setIsSubMenuRelatorioOpen(false);
        setIsSubMenuConfigOpen(false);
        setIsSubMenuConfig1Open(false);
      }
      return newValue;
    });
  };



  const handleLogout = () => {
    router.push("/conta/sair");
  };

  const handleLogin = () => {
    if (location.pathname !== "/login") router.push("/login");
  };

  const handleAutenticacao = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (isAuthenticated) {
      handleLogout();
      setIsOpen(false);
    } else {
      handleLogin();
    }
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    function isPopup() {
      if (typeof window !== "undefined") {
        const hasOpener = !!window.opener;
        const isSmallWindow = window.innerWidth < 600 && window.innerHeight < 600;
        return hasOpener || isSmallWindow;
      }
      return false;
    }
    setIsPopupWindow(isPopup());
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Se for uma popup, não exibe menu/header
  if (isPopupWindow) {
    return (
      <div className="md:pl-12 pt-0">
        <div>{children}</div>
      </div>
    );
  }

  return (
    <>
      {/* Cabeçalho */}
      <div
        className={`fixed top-0 z-10 bg-white shadow-sm transition-all duration-200 left-0 right-0 ${isMenuOpen ? "sm:left-60" : "sm:left-12"
          }`}
      >
        <div className="flex items-center justify-between p-3 pl-5 pr-5 shadow-lg">
          <div className="flex items-center">
            {/* Botão Hambúrguer (mobile) */}
            <div className="sm:hidden">
              <button onClick={handleToggleMenu} className="focus:outline-none">
                <MenuIcon />
              </button>
            </div>
            {/* Logo (header) - exibe somente em telas sm ou maiores */}
            <div className="hidden sm:flex">
              {isMenuOpen ? (
                <div className="flex items-center">
                  <MenuOpen fontSize="medium" className="text-primary-500" />
                  <span className="ml-2 text-body-small text-neutrals-900">
                    Sistema de Gestão Universitaria
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <MenuIcon fontSize="medium" className="text-primary-500" />
                  <span className="ml-2 text-body-small text-neutrals-900">
                    Sistema de Gestão Universitaria                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Menu de Ações (Entrar / Sair / Sobre) */}
          <div className="flex items-center space-x-1">
            {isAuthenticated && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center w-full px-3 py-0 text-md font-normal text-black rounded-md hover:bg-gray-100 focus:outline-none"
                  style={{ color: "#1A4568" }}
                >
                  <AccountCircleOutlined fontSize="small" className="text-primary-500" />
                  <span className="ml-2">{usuarioLogado}</span>
                  {isOpen ? (
                    <ExpandLessIcon fontSize="small" className="ml-1" />
                  ) : (
                    <ExpandMoreIcon fontSize="small" className="ml-1" />
                  )}
                </button>
                {isOpen && (
                  <div className="absolute right-0 w-56 mt-5 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg">
                    <div className="py-1">
                      <Link href="/conta/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Minha conta
                      </Link>
                      <Link href="/conta/redefinir-senha" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Alterar senha
                      </Link>

                      <Link
                        href="#"
                        onClick={handleAutenticacao}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sair
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MENU LATERAL SOBREPOSTO */}
      <div
        className={`fixed top-0 left-0 h-screen bg-secondary-500 shadow-lg transition-all duration-200 z-20 ${isMenuOpen ? "w-60" : "w-12"
          } ${!isMenuOpen ? "max-sm:hidden" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Área da logo no menu lateral */}
        <div
          className={`border-b border-gray-500 overflow-hidden transition-all duration-300 flex items-center justify-center ${isMenuOpen ? "w-60" : "w-12"
            } h-12`}
        >
          <a href="/" title="WS Consultoria Pública" className="flex items-center">
            <GpsFixed fontSize="medium" className="text-white" />
          </a>
          {isMenuOpen && <span className="ml-3 text-white whitespace-nowrap">SGU</span>}
        </div>
        {/* Corpo do menu em coluna: itens no topo, "Ajuda" no rodapé */}
        <div className="flex flex-col h-[calc(100vh-3rem)]">
          <div className="pt-4 px-2 flex-1 overflow-y-auto">
            <ul className="space-y-4 text-gray-500">
              {/* INÍCIO */}
              <li>
                <Link
                  href="/home"
                  className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                    }`}
                >
                  <HomeOutlined fontSize="medium" className="text-white" />
                  <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Início</h6>
                </Link>
              </li>

              {/* SGU AUTH SERVICES */}
              {isAuthenticated && isAdmin && (
                <>
                  <li>
                    <Link
                      href="/cursos"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <School fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Cursos</h6>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/solicitacoes"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <PendingActions fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Solicitações de Perfils</h6>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/usuarios"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <Groups2 fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Usuários</h6>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/unidades-administrativas"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <CastForEducation fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Unidades Administrativas</h6>
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && isGestor && (
                <>
                 
                  <li>
                    <Link
                      href="/solicitacoes"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <PendingActions fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Solicitar de Perfil</h6>
                    </Link>
                  </li>
                  
                </>
              )}
              {isAuthenticated && isTecnico && (
                <>
                 
                  <li>
                    <Link
                      href="/solicitacoes"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <PendingActions fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Solicitar de Perfil</h6>
                    </Link>
                  </li>
                  
                </>
              )}
              {isAuthenticated && isProfessor && (
                <>
                 
                  <li>
                    <Link
                      href="/solicitacoes"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <PendingActions fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Solicitar de Perfil</h6>
                    </Link>
                  </li>
                  
                </>
              )}
              {isAuthenticated && isAluno && (
                <>
                 
                  <li>
                    <Link
                      href="/solicitacoes"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <PendingActions fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Solicitar de Perfil</h6>
                    </Link>
                  </li>
                  
                </>
              )}
              {isAuthenticated && isVisitante && (
                <>
                 
                  <li>
                    <Link
                      href="/solicitacoes"
                      className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                        }`}
                    >
                      <PendingActions fontSize="medium" className="text-white" />
                      <h6 className={`${isMenuOpen ? "ml-3 text-white" : "hidden"}`}>Solicitar de Perfil</h6>
                    </Link>
                  </li>
                  
                </>
              )}
              

            </ul>
          </div>
          {/* Link de Ajuda fixado no rodapé do menu */}
          <div className="p-2">
            <Link
              href="/home"
              className={`flex items-center rounded-md p-2 transition-colors duration-200 ${isMenuOpen ? "hover:bg-primary-900 justify-start" : "justify-center"
                }`}
            >
              <HelpOutline fontSize="medium" className="text-white" />
              {isMenuOpen && <span className="ml-3 text-white">Ajuda</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="pt-12">
        <div>{children}</div>
      </div>
    </>
  );
}
