"use client";
import { generica } from "@/utils/api";
import aplicarMascara from "@/utils/mascaras";
import {
  AccountCircleOutlined,
  Delete,
  Edit,
  PersonOutlineOutlined,
  RemoveRedEye,
  VisibilityOffOutlined,
  VisibilityOutlined
} from "@mui/icons-material";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

/**
 * Tipo (opcional) para cada campo de configuração do formulário
 */
export type Campo = {
  line?: number;
  colSpan?: string; // Exemplo: "md:col-span-2" => a partir do breakpoint md, o campo ocupa 2 colunas
  nome: string;
  chave: string; // Pode ser "solicitante.nome" para dados aninhados
  tipo: string;  // 'text', 'number', 'foto', 'documento', etc.
  mensagem: string;
  obrigatorio?: boolean;
  bloqueado?: boolean;
  oculto?: boolean;
  selectOptions?: { chave: any; valor: string }[] | null;
  max?: number;
  step?: number;
  allSelect?: boolean; // para multi-select com "selecionar tudo"
  mascara?: string;
  exibirPara?: string[]; // Perfis que podem ver/editar este campo
};

// -------------------------------------------------------------
// Funções auxiliares para lidar com dados aninhados (ex: "a.b.c")
// -------------------------------------------------------------
const getNestedValue = (obj: any, path: string): any =>
  path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);

const setNestedValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const newObj = { ...obj };
  let curr = newObj;
  keys.forEach((key) => {
    curr[key] = curr[key] ? { ...curr[key] } : {};
    curr = curr[key];
  });
  if (lastKey) {
    curr[lastKey] = value;
  }
  return newObj;
};

const updateNestedField = (prev: any, name: string, value: any): any =>
  name.includes('.') ? setNestedValue(prev, name, value) : { ...prev, [name]: value };

const Cadastro = ({
  estrutura = null,
  dadosPreenchidos = null,
  setDadosPreenchidos = null,
  chamarFuncao = null,
}: any) => {
  const { id } = useParams();
  // Ajuste sua regra para isEditMode
  const isEditMode = id && id !== "criar";
  // -------------------------------------------------------------
  // Estados internos para multi-select e outros
  // -------------------------------------------------------------
  const [multiSelectOpen, setMultiSelectOpen] = useState<any>({});
  const multiSelectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [initializedFields, setInitializedFields] = useState<any>({});
  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});
  const [multiSelectSearch, setMultiSelectSearch] = useState<Record<string, string>>({});
  const [filteredUnidadesGestoras, setFilteredUnidadesGestoras] = useState<any[]>([]);
  const [lastMunicipioQuery, setLastMunicipioQuery] = useState("");

  const [expandedDocUrl, setExpandedDocUrl] = useState<string | null>(null);
  const [expandedDocType, setExpandedDocType] = useState<string | null>(null);

  const handleExpand = (docUrl: string, docType: string) => {
    setExpandedDocUrl(docUrl);
    setExpandedDocType(docType);
  };

  const closeModal = () => {
    setExpandedDocUrl(null);
    setExpandedDocType(null);
  };
  const downloadFile = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop() || "documento";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // -------------------------------------------------------------
  // Estado para pré-visualização de imagem (campo "foto")
  // -------------------------------------------------------------
  const [photoPreview, setPhotoPreview] = useState<string>("");

  useEffect(() => {
    if (estrutura?.cadastro?.campos) {
      const allCampos = Array.isArray(estrutura.cadastro.campos[0])
        ? estrutura.cadastro.campos.flat()
        : estrutura.cadastro.campos;
      const fotoCampo = allCampos.find((c: any) => c.tipo === "foto");
      if (fotoCampo) {
        const valor = getNestedValue(dadosPreenchidos, fotoCampo.chave);
        if (valor && typeof valor === "string") {
          setPhotoPreview(valor);
        }
      }
    }
  }, [dadosPreenchidos, estrutura]);

  // -------------------------------------------------------------
  // Exemplo de uso de "generica" para buscar dados
  // -------------------------------------------------------------
  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const options = lista.map((item) => ({
      chave: item.chave,
      valor: item.valor,
    }));
    if (selecionado) {
      const selectedId = Number(selecionado);
      const selectedOption = options.find((opt) => Number(opt.chave) === selectedId);
      if (selectedOption) {
        return [selectedOption, ...options.filter((opt) => Number(opt.chave) !== selectedId)];
      }
    }
    return options;
  };

  // -------------------------------------------------------------
  // Estado local para adicionar UG/Role
  // -------------------------------------------------------------
  const [newUnidadeRole, setNewUnidadeRole] = useState({
    filter: "",
    unidadeGestora: 0,
    role: "",
  });

  // -------------------------------------------------------------
  // Exemplo de fetch: buscar unidades gestoras (filtradas por município)
  // -------------------------------------------------------------
  useEffect(() => {
    if (newUnidadeRole?.filter && newUnidadeRole.filter !== lastMunicipioQuery) {
      const timer = setTimeout(() => {
        setLastMunicipioQuery(newUnidadeRole.filter);
        unidadesGestorasRegistro(newUnidadeRole.filter);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [newUnidadeRole.filter, lastMunicipioQuery]);

  const unidadesGestorasRegistro = async (municipio: string) => {
    try {
      const body = {
        metodo: "get",
        uri: `/unidadeGestora/municipio/${municipio}`,
        params: {},
        data: {},
      };
      const response = await generica(body);
      if (!response) throw new Error("Resposta inválida do servidor.");
      if (response.data.errors || response.data.error) {
        toast.error("Erro ao carregar unidades gestoras", { position: "top-left" });
      } else {
        setFilteredUnidadesGestoras(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar unidades gestoras:", error);
      toast.error("Erro ao carregar unidades gestoras. Tente novamente!", { position: "top-left" });
    }
  };

  // -------------------------------------------------------------
  // Verifica se a tela é mobile (largura < 768px)
  // -------------------------------------------------------------
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------------------------------------
  // Função auxiliar para extrair o valor numérico do colSpan
  // -------------------------------------------------------------
  const getColSpanValue = (campo: Campo): number => {
    if (campo.colSpan) {
      const match = campo.colSpan.match(/col-span-(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
    return 1;
  };

  // -------------------------------------------------------------
  // SUBMIT: coleta dados do formulário e chama a função de submit
  // -------------------------------------------------------------
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const native = event.nativeEvent as SubmitEvent;
    const submitter = native.submitter as HTMLButtonElement | null;
    const action = submitter?.name || "salvar"; // fallback
  
    const formData = new FormData(event.currentTarget);
    const data: any = {};

    formData.forEach((value: any, key: string) => {
      if (key.startsWith("role_") || key === "unidadesGestorasRoles") return;
      const campo: Campo | undefined = Array.isArray(estrutura.cadastro.campos[0])
        ? estrutura.cadastro.campos.flat().find((c: Campo) => c.chave === key)
        : estrutura.cadastro.campos.find((c: Campo) => c.chave === key);
      if (campo && campo.tipo === "ratio") {
        data[key] = value !== "" ? parseFloat(value.toString()) / 100 : null;
      } else if (campo && campo.tipo === "multi-select") {
        data[key] = value ? value.split(",") : [];
      } else {
        data[key] = value;
      }
    });

    if (dadosPreenchidos.unidadesGestorasRoles) {
      data.unidadesGestorasRoles = dadosPreenchidos.unidadesGestorasRoles;
    }
    if (dadosPreenchidos.documentos){
      data.documentos= dadosPreenchidos.documentos;
    }
    if(dadosPreenchidos.parecer){
      data.parecer= dadosPreenchidos.parecer;
    }
    chamarFuncao(action, data);
  };

  // -------------------------------------------------------------
  // Handlers para inputs (suporte a chaves aninhadas)
  // -------------------------------------------------------------
  const alterarInput = (event: React.ChangeEvent<HTMLInputElement>, campo?: Campo) => {
    const { name, value } = event.target;
    let valorFinal = value;
    if (campo && campo.mascara) {
      valorFinal = aplicarMascara(value, campo.mascara);
    }
    setDadosPreenchidos((prev: any) => updateNestedField(prev, name, valorFinal));
  };

  const alterarSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prev: any) => updateNestedField(prev, name, value));
  };

  const alterarRadioGroup = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prev: any) => updateNestedField(prev, name, value));
  };

  const alterarCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setDadosPreenchidos((prev: any) => updateNestedField(prev, name, checked));
  };

  const alterarDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prev: any) => updateNestedField(prev, name, value));
  };

  const alterarAno = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setDadosPreenchidos((prev: any) => updateNestedField(prev, name, value));
  };

  const alterarRatio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const ratioValue = value !== "" ? parseFloat(value) / 100 : null;
    setDadosPreenchidos((prev: any) => updateNestedField(prev, name, ratioValue));
  };

  // -------------------------------------------------------------
  // Handler específico para arquivos (foto ou documento)
  // -------------------------------------------------------------
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, campo: Campo) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
    }
    setDadosPreenchidos((prev: any) => updateNestedField(prev, campo.chave, file));
  };

  // -------------------------------------------------------------
  // Handlers para multi-select
  // -------------------------------------------------------------
  const alterarMultiSelect = (event: React.ChangeEvent<HTMLInputElement>, chave: string) => {
    const { value } = event.target;
    setDadosPreenchidos((prev: any) => {
      const selected = prev[chave] || [];
      return selected.includes(value)
        ? { ...prev, [chave]: selected.filter((v: any) => v !== value) }
        : { ...prev, [chave]: [...selected, value] };
    });
  };

  const alterarSelectAll = (chave: string) => {
    setDadosPreenchidos((prev: any) => {
      const campo: Campo | undefined = Array.isArray(estrutura.cadastro.campos[0])
        ? estrutura.cadastro.campos.flat().find((c: Campo) => c.chave === chave)
        : estrutura.cadastro.campos.find((c: Campo) => c.chave === chave);
      const allOptions = campo?.selectOptions || [];
      const allValues = allOptions.map((opt) => opt.chave.toString());
      const isAll = prev[chave]?.length === allValues.length;
      return { ...prev, [chave]: isAll ? [] : allValues };
    });
  };

  const toggleMultiSelect = (chave: string) => {
    setMultiSelectOpen((prev: any) => ({ ...prev, [chave]: !prev[chave] }));
  };

  const handleClickOutside = (event: any) => {
    Object.keys(multiSelectRefs.current).forEach((chave: string) => {
      const ref = multiSelectRefs.current[chave];
      if (ref && !ref.contains(event.target)) {
        setMultiSelectOpen((prev: any) => ({ ...prev, [chave]: false }));
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------------------------------------
  // Inicializa multi-select com "allSelect" se necessário
  // -------------------------------------------------------------
  useEffect(() => {
    if (estrutura?.cadastro?.campos) {
      const allCampos = Array.isArray(estrutura.cadastro.campos[0])
        ? estrutura.cadastro.campos.flat()
        : estrutura.cadastro.campos;
      allCampos.forEach((campo: Campo) => {
        if (
          campo.tipo === "multi-select" &&
          campo.allSelect === true &&
          campo.selectOptions?.length &&
          !initializedFields[campo.chave]
        ) {
          if (!dadosPreenchidos[campo.chave] || dadosPreenchidos[campo.chave].length === 0) {
            const allValues = campo.selectOptions.map((opt) => opt.chave.toString());
            setDadosPreenchidos((prev: any) => ({ ...prev, [campo.chave]: allValues }));
            setInitializedFields((prev: any) => ({ ...prev, [campo.chave]: true }));
          }
        }
      });
    }
  }, [estrutura, initializedFields]);

  // -------------------------------------------------------------
  // Exemplo de formatação de data/hora (se necessário)
  // -------------------------------------------------------------
  const verificaDataHora = (texto: any) => {
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})[+-]\d{2}:\d{2}$/;
    if (texto && isoRegex.test(texto)) {
      const [datePart, timePart] = texto.split("T");
      const [ano, mes, dia] = datePart.split("-");
      const hora = timePart.split(".")[0];
      return `${dia}/${mes}/${ano} ${hora}`;
    }
    return texto;
  };

  // -------------------------------------------------------------
  // Gera anos para campos do tipo "year"
  // -------------------------------------------------------------
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear; i >= 1980; i--) {
      years.push(i);
    }
    return years;
  };

  // -------------------------------------------------------------
  // Agrupa campos por "line"
  // -------------------------------------------------------------
  const agruparPorLinha = (): Record<number, Campo[]> => {
    const grouped: Record<number, Campo[]> = {};
    if (estrutura?.cadastro?.campos) {
      const allCampos = Array.isArray(estrutura.cadastro.campos[0])
        ? estrutura.cadastro.campos.flat()
        : estrutura.cadastro.campos;
      allCampos.forEach((campo: Campo) => {
        const linha = campo.line || 1;
        if (!grouped[linha]) grouped[linha] = [];
        grouped[linha].push(campo);
      });
    }
    return grouped;
  };

  const camposPorLinha = agruparPorLinha();
  const linhasOrdenadas = Object.keys(camposPorLinha)
    .map((n) => parseInt(n, 10))
    .sort((a, b) => a - b);

  return (
    <div className="rounded-md p-6">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Campo oculto para o ID */}
        <input type="hidden" name="id" value={dadosPreenchidos?.id || ""} />

        {linhasOrdenadas.map((numeroLinha) => {
          // Filtra os campos que devem ser renderizados nessa linha
          const camposFiltrados = camposPorLinha[numeroLinha].filter((campo: Campo) => {
            const profileType =
              getNestedValue(dadosPreenchidos, "perfil.tipo") ||
              dadosPreenchidos?.tipoUsuario ||
              "default";
            if (campo.oculto) return false;
            if (campo.exibirPara && !campo.exibirPara.includes(profileType)) return false;
            if (isEditMode && campo.chave === "tipoPerfil" && campo.exibirPara && !campo.exibirPara.includes(profileType))
              return false;
            return true;
          });
          // Calcula as colunas somente com os campos filtrados
          const totalCols = isMobile
            ? 1
            : camposFiltrados.reduce((acc, campo) => acc + getColSpanValue(campo), 0);
          const gridColumns = isMobile
            ? "repeat(1, minmax(0, 1fr))"
            : `repeat(${totalCols}, minmax(0, 1fr))`;

          return (
            <div key={numeroLinha} className="grid gap-4 mb-6" style={{ gridTemplateColumns: gridColumns }}>
              {camposFiltrados.map((campo: Campo, idx: number) => (
                <div key={idx} className={`flex flex-col ${campo.colSpan ?? ""}`}>
                  {campo.tipo === "text" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <input
                        type="text"
                        name={campo.chave}
                        placeholder={campo.mensagem}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-300 text-body-medium text-neutrals-900"
                        value={getNestedValue(dadosPreenchidos, campo.chave) || ""}
                        onChange={(e) => alterarInput(e, campo)}
                        disabled={campo.bloqueado}
                        required={campo.obrigatorio}
                      />
                    </>
                  )}

                  {campo.tipo === "foto" && (
                    <div className="flex flex-col">
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-2 border-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                          {photoPreview ? (
                            <img
                              src={photoPreview}
                              alt="Pré-visualização"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <PersonOutlineOutlined
                              style={{ fontSize: 64, color: "#999999" }}
                              aria-label="Foto de Perfil Padrão"
                            />
                          )}
                        </div>
                        {(isEditMode || id === "criar") && (
                          <>{!isEditMode &&
                            <label
                              htmlFor={`fotoInput-${campo.chave}`}
                              className="absolute bottom-0 right-0 mb-1 mr-1 bg-white p-1 rounded-full cursor-pointer shadow-sm z-10"
                            >
                              <Edit fontSize="small" className="text-primary-500" />
                            </label>
                          }
                            <input
                              id={`fotoInput-${campo.chave}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileChange(e, campo)}
                              disabled={campo.bloqueado}
                              required={campo.obrigatorio}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  {campo.tipo === "documento" && (
                    <div className="flex flex-col">
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>

                      {/* Input de arquivo (somente se estiver em modo edição ou "criar") */}
                      {(isEditMode || id === "criar") && (
                        <>
                          <label
                            htmlFor={`docInput-${campo.chave}`}
                            className="bg-white p-2 rounded cursor-pointer shadow-sm inline-block text-sm text-primary-500 mt-2"
                          >
                            Adicionar Documento(s)
                          </label>
                          <input
                            id={`docInput-${campo.chave}`}
                            type="file"
                            accept=".pdf,.png,.jpeg,.jpg"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const fileArray = Array.from(files);
                                setDadosPreenchidos((prev: any) => ({
                                  ...prev,
                                  [campo.chave]: prev[campo.chave]
                                    ? [...prev[campo.chave], ...fileArray]
                                    : fileArray,
                                }));
                              }
                            }}
                            disabled={campo.bloqueado}
                            required={
                              campo.obrigatorio &&
                              (!dadosPreenchidos[campo.chave] ||
                                dadosPreenchidos[campo.chave].length === 0)
                            }
                          />
                        </>
                      )}

                      {/* Cards de documentos */}
                      {dadosPreenchidos[campo.chave] && dadosPreenchidos[campo.chave].length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                          {dadosPreenchidos[campo.chave].map((doc: any, index: number) => {
                            // Gera a URL do documento (caso seja File)
                            const docUrl =
                              typeof doc === "string" ? doc : URL.createObjectURL(doc);

                            // Detecta PDF ou imagem
                            const isPdf =
                              doc instanceof File
                                ? doc.type === "application/pdf"
                                : docUrl.toLowerCase().endsWith(".pdf");
                            const isImage =
                              doc instanceof File
                                ? doc.type.startsWith("image/")
                                : /\.(png|jpe?g)$/i.test(docUrl);

                            const docType = isPdf ? "pdf" : isImage ? "image" : "other";

                            return (
                              <div
                                key={index}
                                className="relative border border-gray-300 rounded cursor-pointer hover:shadow-lg transition-all p-1"
                                onClick={() => handleExpand(docUrl, docType)}
                              >
                                {/* Container fixo para preview (sem scroll) */}
                                <div className="pointer-events-none w-full h-40 md:h-48 overflow-hidden rounded">
                                  {isPdf ? (
                                    <iframe
                                      src={docUrl}
                                      title={`Documento ${index}`}
                                      className="w-full h-full"
                                      style={{ border: "none" }}
                                    />
                                  ) : isImage ? (
                                    <img
                                      src={docUrl}
                                      alt={`Documento ${index}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <p className="p-2 text-sm text-gray-700 break-words">
                                      {typeof doc === "string" ? doc.split("/").pop() : doc.name}
                                    </p>
                                  )}
                                </div>

                                {/* Botão "Deletar" no canto superior direito (exibido se não está em modo edição) */}
                                {!isEditMode && (
                                  <div className="absolute top-2 right-2 z-10">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation(); // Não expande o modal
                                        setDadosPreenchidos((prev: any) => {
                                          const updated = [...(prev[campo.chave] || [])];
                                          updated.splice(index, 1);
                                          return { ...prev, [campo.chave]: updated };
                                        });
                                      }}
                                      className="
                      px-2 py-1
                      bg-danger-500
                      text-white
                      text-sm
                      rounded
                      transition-colors
                      hover:bg-danger-700
                    "
                                    >
                                      Deletar
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">Nenhum documento anexado.</p>
                      )}

                      {/* Modal para visualização expandida */}
                      {expandedDocUrl && (
                        <div
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                          onClick={closeModal}
                        >
                          <div
                            className="
        bg-white
        rounded
        shadow-lg
        w-full
        max-w-5xl      /* Maior largura permitida, pode ajustar conforme o layout */
        max-h-[90vh]   /* 90% da altura da viewport */
        flex
        flex-col
      "
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Cabeçalho do modal */}
                            <div className="flex items-center justify-between p-4 border-b">
                              <button
                                onClick={closeModal}
                                className="text-danger-500 font-bold"
                              >
                                Fechar
                              </button>
                              <div className="flex space-x-2">
                                {/* Botão de baixar */}
                                <a
                                  href={expandedDocUrl}
                                  download
                                  className="
              px-2 py-1
              bg-primary-500
              text-white
              text-sm
              rounded
              hover:bg-primary-700
            "
                                >
                                  Baixar
                                </a>
                                {/* Botão de visualizar em nova guia */}
                                <a
                                  href={expandedDocUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="
              px-2 py-1
              bg-primary-500
              text-white
              text-sm
              rounded
              hover:bg-primary-700
            "
                                >
                                  Visualizar
                                </a>
                              </div>
                            </div>

                            {/* Corpo do modal (flex-1 para crescer e overflow-auto para permitir rolagem) */}
                            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
                              {expandedDocType === "pdf" ? (
                                <iframe
                                  src={expandedDocUrl}
                                  title="Documento expandido"
                                  className="w-full h-full"
                                  style={{ minHeight: '600px', border: 'none' }}
                                  scrolling="auto" /* permite rolagem se necessário */
                                />
                              ) : expandedDocType === "image" ? (
                                <img
                                  src={expandedDocUrl}
                                  alt="Documento expandido"
                                  className="max-w-full max-h-full"
                                />
                              ) : (
                                <p className="text-sm text-gray-700 p-4">
                                  {expandedDocUrl.split("/").pop()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                  {campo.tipo === "radio-group" && (
                    <div className={`flex flex-col ${campo.colSpan ?? ""}`}>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <div className="flex gap-4">
                        {campo.selectOptions?.map((option, oIdx) => (
                          <label key={oIdx} className="flex items-center gap-1">
                            <input
                              type="radio"
                              name={campo.chave}
                              value={option.chave.toString()}
                              checked={
                                getNestedValue(dadosPreenchidos, campo.chave)?.toString() ===
                                option.chave.toString()
                              }
                              onChange={alterarRadioGroup}
                              className="w-4 h-4 text-primary-600"
                            />
                            <span className="text-body-medium text-neutrals-900">
                              {option.valor}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {campo.tipo === "number" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <input
                        type="number"
                        name={campo.chave}
                        placeholder={campo.mensagem}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-300 text-body-medium text-neutrals-900"
                        value={getNestedValue(dadosPreenchidos, campo.chave) || ""}
                        onChange={(e) => alterarInput(e, campo)}
                        disabled={campo.bloqueado}
                        required={campo.obrigatorio}
                      />
                    </>
                  )}

                  {campo.tipo === "select" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <select
                        name={campo.chave}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-body-medium text-neutrals-900"
                        value={getNestedValue(dadosPreenchidos, campo.chave) || ""}
                        onChange={alterarSelect}
                        disabled={campo.bloqueado}
                        required={campo.obrigatorio}
                      >
                        <option value="">{campo.mensagem}</option>
                        {campo.selectOptions?.map((option, oIdx: number) => (
                          <option key={oIdx} value={option.chave}>
                            {option.valor}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  {campo.tipo === "boolean" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <input
                        type="checkbox"
                        name={campo.chave}
                        className="w-4 h-4 mt-2 text-primary-600 border-neutrals-300 rounded focus:ring-primary-500"
                        checked={getNestedValue(dadosPreenchidos, campo.chave) || false}
                        onChange={alterarCheckbox}
                        disabled={campo.bloqueado}
                        required={campo.obrigatorio}
                      />
                    </>
                  )}

                  {campo.tipo === "date" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <input
                        type="date"
                        name={campo.chave}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-300 text-body-medium text-neutrals-900"
                        value={getNestedValue(dadosPreenchidos, campo.chave) || ""}
                        onChange={alterarDate}
                        disabled={campo.bloqueado}
                        required={campo.obrigatorio}
                      />
                    </>
                  )}

                  {campo.tipo === "year" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <select
                        name={campo.chave}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-body-medium text-neutrals-900"
                        value={getNestedValue(dadosPreenchidos, campo.chave) || ""}
                        onChange={alterarAno}
                        disabled={campo.bloqueado}
                        required={campo.obrigatorio}
                      >
                        <option value="">Selecione o ano</option>
                        {generateYears().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  {campo.tipo === "ratio" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <input
                        type="number"
                        name={campo.chave}
                        placeholder={campo.mensagem}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-300 text-body-medium text-neutrals-900"
                        value={
                          getNestedValue(dadosPreenchidos, campo.chave) != null
                            ? getNestedValue(dadosPreenchidos, campo.chave) * 100
                            : ""
                        }
                        onChange={alterarRatio}
                        disabled={campo.bloqueado}
                        required={campo.obrigatorio}
                        min={0}
                        max={campo.max || 100}
                        step={campo.step || 1}
                      />
                      <span className="text-sm text-neutrals-500 mt-1">
                        Máximo: {campo.max || 100}%
                      </span>
                    </>
                  )}

                  {campo.tipo === "password" && (
                    <>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={passwordVisibility[campo.chave] ? "text" : "password"}
                          name={campo.chave}
                          placeholder={campo.mensagem}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary-300 text-body-medium text-neutrals-900"
                          value={getNestedValue(dadosPreenchidos, campo.chave) || ""}
                          onChange={(e) => alterarInput(e, campo)}
                          disabled={campo.bloqueado}
                          required={campo.obrigatorio}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPasswordVisibility((prev) => ({
                              ...prev,
                              [campo.chave]: !prev[campo.chave],
                            }))
                          }
                          className="absolute inset-y-0 right-0 px-3 flex items-center"
                        >
                          {passwordVisibility[campo.chave] ? (
                            <VisibilityOffOutlined fontSize="small" className="text-primary-500" />
                          ) : (
                            <VisibilityOutlined fontSize="small" className="text-primary-500" />
                          )}
                        </button>
                      </div>
                    </>
                  )}

                  {campo.tipo === "unidadesGestorasRoles" && (
                    <div className={`flex flex-col ${campo.colSpan ?? ""}`}>
                      <label className="block mb-1 text-label-medium text-primary-500">
                        {campo.nome}
                        {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                      </label>
                      <div className="flex flex-row gap-2 items-center border rounded mb-4">
                        <input
                          type="text"
                          placeholder="Filtrar UG..."
                          className="w-full p-2 border rounded"
                          value={newUnidadeRole.filter}
                          onChange={(e) =>
                            setNewUnidadeRole({ ...newUnidadeRole, filter: e.target.value })
                          }
                        />
                        <select
                          value={newUnidadeRole.unidadeGestora}
                          onChange={(e) =>
                            setNewUnidadeRole({ ...newUnidadeRole, unidadeGestora: Number(e.target.value) })
                          }
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Selecione a UG</option>
                          {filteredUnidadesGestoras.map((ug, idx) => (
                            <option key={idx} value={ug.id}>
                              {ug.nome}
                            </option>
                          ))}
                        </select>
                        <select
                          value={newUnidadeRole.role}
                          onChange={(e) =>
                            setNewUnidadeRole({ ...newUnidadeRole, role: e.target.value })
                          }
                          className="w-full p-2 border rounded"
                        >
                          <option value="">Selecione a Role</option>
                          <option value="ADMIN">Administrador</option>
                          <option value="GESTOR">Gestor</option>
                          <option value="ANALISTA">Analista</option>
                          <option value="USUARIO">Usuário</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (newUnidadeRole.unidadeGestora && newUnidadeRole.role) {
                              setDadosPreenchidos((prev: any) => {
                                const updated = [...(prev[campo.chave] || [])];
                                updated.push({
                                  unidadeGestora: newUnidadeRole.unidadeGestora,
                                  role: newUnidadeRole.role,
                                });
                                return { ...prev, [campo.chave]: updated };
                              });
                              setNewUnidadeRole({ filter: "", unidadeGestora: 0, role: "" });
                            } else {
                              toast("Preencha ambos os campos para adicionar.", { position: "top-left" });
                            }
                          }}
                          className="bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded"
                        >
                          Adicionar
                        </button>
                      </div>
                      <div className="flex flex-col gap-2">
                        {(dadosPreenchidos?.[campo.chave] || []).map((item: any, index: number) => {
                          const matchedUg = campo.selectOptions?.find(
                            (opt: any) => Number(opt.chave) === Number(item.unidadeGestora)
                          );
                          return (
                            <div key={index} className="flex gap-2 items-center">
                              <select
                                name={`unidadeGestora_${index}`}
                                value={matchedUg ? String(matchedUg.chave) : ""}
                                className="w-full p-2 border rounded"
                                disabled
                              >
                                {matchedUg ? (
                                  <option value={String(matchedUg.chave)}>
                                    {matchedUg.valor}
                                  </option>
                                ) : (
                                  <option value="">Selecione a UG</option>
                                )}
                              </select>
                              <select
                                name={`role_${index}`}
                                value={item.role || ""}
                                onChange={(e) => {
                                  const newValue = e.target.value;
                                  setDadosPreenchidos((prev: any) => {
                                    const updated = [...(prev[campo.chave] || [])];
                                    updated[index].role = newValue;
                                    return { ...prev, [campo.chave]: updated };
                                  });
                                }}
                                className="w-full p-2 border rounded"
                              >
                                <option value="">Selecione a Role</option>
                                <option value="ADMIN">Administrador</option>
                                <option value="GESTOR">Gestor</option>
                                <option value="ANALISTA">Analista</option>
                                <option value="USUARIO">Usuário</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => {
                                  setDadosPreenchidos((prev: any) => {
                                    const updated = [...(prev[campo.chave] || [])];
                                    updated.splice(index, 1);
                                    return { ...prev, [campo.chave]: updated };
                                  });
                                }}
                                className="text-red-500"
                              >
                                Remover
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {campo.tipo === "multi-select" && (() => {
                    // Se o campo for "perfil.cursos", construímos as opções a partir do array de cursos retornado
                    const options =
                      campo.selectOptions ||
                      (campo.chave === "perfil.cursos"
                        ? (dadosPreenchidos?.perfil?.cursos?.map((curso: any) => ({
                          chave: curso.id.toString(),
                          valor: curso.nome,
                        })) || [])
                        : []);
                    // O valor selecionado também é adaptado
                    const selectedValues =
                      campo.chave === "perfil.cursos"
                        ? (dadosPreenchidos?.perfil?.cursos?.map((curso: any) => curso.id.toString()) || [])
                        : dadosPreenchidos[campo.chave];

                    return (
                      <div
                        className="flex flex-col relative"
                        style={{ gridColumn: `span ${getColSpanValue(campo)}` }}
                        ref={(el) => {
                          multiSelectRefs.current[campo.chave] = el;
                        }}
                      >
                        <label className="block mb-1 text-label-medium text-primary-500">
                          {campo.nome}
                          {campo.obrigatorio && <span className="text-danger-500 ml-1">*</span>}
                        </label>
                        <button
                          type="button"
                          className="w-full p-2 border rounded text-left focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white text-body-medium text-neutrals-900"
                          onClick={() => toggleMultiSelect(campo.chave)}
                        >
                          {selectedValues && selectedValues.length > 0
                            ? `Selecionados: ${selectedValues.length} item${selectedValues.length > 1 ? "s" : ""}`
                            : campo.mensagem}
                        </button>
                        {/* Campo hidden para enviar o array como string */}
                        <input
                          type="hidden"
                          name={campo.chave}
                          value={selectedValues ? selectedValues.join(",") : ""}
                        />
                        {multiSelectOpen[campo.chave] && (
                          <div className="absolute top-full left-0 z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-48 overflow-y-auto">
                            <div className="p-2 border-b">
                              <input
                                type="text"
                                placeholder="Buscar..."
                                className="w-full p-2 border rounded focus:outline-none"
                                value={multiSelectSearch[campo.chave] || ""}
                                onChange={(e) =>
                                  setMultiSelectSearch((prev) => ({
                                    ...prev,
                                    [campo.chave]: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="flex items-center p-2 border-b hover:bg-neutrals-50">
                              <input
                                id={`checkbox-${campo.chave}-select-all`}
                                type="checkbox"
                                checked={
                                  selectedValues &&
                                  options &&
                                  selectedValues.length === options.length &&
                                  options.length > 0
                                }
                                onChange={() => alterarSelectAll(campo.chave)}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                              />
                              <label htmlFor={`checkbox-${campo.chave}-select-all`} className="ml-2 text-sm">
                                Selecionar Tudo
                              </label>
                            </div>
                            {options
                              ?.filter((option: any) => {
                                const searchTerm = multiSelectSearch[campo.chave] || "";
                                return option.valor.toLowerCase().includes(searchTerm.toLowerCase());
                              })
                              .map((option: any, oIdx: any) => (
                                <div key={oIdx} className="flex items-center p-2 hover:bg-neutrals-50">
                                  <input
                                    id={`checkbox-${campo.chave}-${oIdx}`}
                                    type="checkbox"
                                    value={option.chave}
                                    checked={selectedValues?.includes(option.chave)}
                                    onChange={(event) => alterarMultiSelect(event, campo.chave)}
                                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                                  />
                                  <label htmlFor={`checkbox-${campo.chave}-${oIdx}`} className="ml-2 text-sm">
                                    {option.valor}
                                  </label>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                </div>
              ))}
            </div>
          );
        })}

        <div className="flex justify-end mt-4 gap-2">
          {estrutura?.cadastro?.acoes?.map((botao: any, index: number) => {
            const isSubmit = botao.tipo === "submit";
            return (
              <button
                key={index}
                type={isSubmit ? "submit" : "button"}
                name={botao.chave}               // ← aqui
                className={
                  isSubmit
                    ? "bg-primary-500 hover:bg-primary-700 text-white px-4 py-2 rounded text-body-medium"
                    : "bg-neutrals-200 hover:bg-neutrals-300 text-neutrals-700 px-4 py-2 rounded text-body-medium"
                }
                onClick={!isSubmit ? () => chamarFuncao(botao.chave, botao) : undefined}
              >
                {botao.nome}
              </button>
            );
          })}
        </div>
      </form>
    </div>
  );
};

export default Cadastro;
