"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import Calendar from "@/components/CalendarioCronograma/calendar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { generica } from "@/utils/api";

interface TipoAtendimento {
  chave: number;
  valor: string;
}

interface CronogramaData {
  id?: number;
  datas: string[]; // sempre em formato ISO (YYYY-MM-DD)
  tipoAtendimentoId: number;
  endereco?: any;
}

const isValidDate = (dateString: string): boolean => {
  return !isNaN(Date.parse(dateString));
};

// Converte de DD/MM/YYYY para YYYY-MM-DD
const convertToISODate = (brDate: string): string => {
  if (!brDate || !brDate.includes("/")) return "";

  const [dia, mes, ano] = brDate.split("/");
  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

// Converte de YYYY-MM-DD para DD/MM/YYYY
const formatDateToAPI = (dateString: string): string => {
  if (!dateString || typeof dateString !== "string") return "";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) throw new Error(`Data inválida: ${dateString}`);

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();

  return `${dia}/${mes}/${ano}`;
};

const parseDateLocal = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  const [dadosPreenchidos, setDadosPreenchidos] = useState<CronogramaData>({
    datas: [],
    tipoAtendimentoId: 0,
  });
  const [tiposAtendimento, setTiposAtendimento] = useState<TipoAtendimento[]>([]);
  const isEditMode = id && id !== "criar";

  const fetchTiposAtendimento = async () => {
    console.log("Buscando tipos de atendimento...");
    try {
      const response = await generica({
        metodo: "get",
        uri: "/prae/tipo-atendimento",
        params: {},
      });

      console.log("Resposta recebida:", response);
      const tipos = response?.data?.data || response?.data?.content || [];

      setTiposAtendimento(
        tipos.map((tipo: any) => ({
          chave: tipo.id,
          valor: tipo.nome,
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar tipos de atendimento:", error);
    }
  };

  const estrutura = {
    uri: "cronograma",
    cabecalho: {
      titulo: isEditMode ? "Editar Cronograma" : "Cadastrar Cronograma",
      migalha: [
        { nome: "Home", link: "/home" },
        { nome: "Prae", link: "/prae" },
        { nome: "Cronogramas", link: "/prae/agendamentos/cronograma" },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/prae/agendamentos/cronograma/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
      ],
    },
  };

  const handleDateChange = (diasSelecionados: string[]) => {
    // Se não há datas selecionadas, limpa a seleção
    if (diasSelecionados.length === 0) {
      setDadosPreenchidos((prev) => ({
        ...prev,
        datas: [],
      }));
      return;
    }

    // Pega a última data selecionada
    const ultimaDataSelecionada = diasSelecionados[diasSelecionados.length - 1];

    // Verifica se é uma data válida
    if (!isValidDate(ultimaDataSelecionada)) return;

    // Atualiza o estado com apenas a última data selecionada
    setDadosPreenchidos((prev) => ({
      ...prev,
      datas: [ultimaDataSelecionada],
    }));
  };

  const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
    try {
      switch (nomeFuncao) {
        case "salvar":
          await salvarRegistro();
          break;
        case "voltar":
          voltarRegistro();
          break;
        case "editar":
          await editarRegistro(valor);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Erro na função ${nomeFuncao}:`, error);
    }
  };

  const voltarRegistro = () => {
    router.push("/prae/agendamentos/cronograma");
  };

  const salvarRegistro = async () => {
    if (!dadosPreenchidos.tipoAtendimentoId) {
      toast.error("Selecione um tipo de atendimento");
      return;
    }

    if (dadosPreenchidos.datas.length === 0) {
      toast.error("Selecione pelo menos uma data no calendário");
      return;
    }

    try {
      const metodo = isEditMode ? "patch" : "post";
      const uri = isEditMode
        ? `/prae/${estrutura.uri}/${id}`
        : `/prae/${estrutura.uri}`;

      const primeiraData = dadosPreenchidos.datas[0]; // Pega a primeira data

      const dadosParaEnviar = isEditMode
        ? {
          data: formatDateToAPI(primeiraData), // string
          tipoAtendimentoId: Number(dadosPreenchidos.tipoAtendimentoId),
        }
        : {
          datas: dadosPreenchidos.datas.map(formatDateToAPI), // array
          tipoAtendimentoId: Number(dadosPreenchidos.tipoAtendimentoId),
        };

      await generica({
        metodo,
        uri,
        params: {},
        data: dadosParaEnviar,
      });

      Swal.fire({
        title: "Sucesso!",
        text: `Cronograma ${isEditMode ? "atualizado" : "criado"} com sucesso.`,
        icon: "success",
      }).then(() => {
        router.push("/prae/agendamentos/cronograma");
      });
    } catch (error: any) {
      console.error("Erro ao salvar registro:", error);
      toast.error("Erro ao salvar o registro.");
    }
  };


  const editarRegistro = async (item: any) => {
    try {
      const response = await generica({
        metodo: "get",
        uri: `/prae/${estrutura.uri}/${item}`,
        params: {},
      });

      if (!response) throw new Error("Resposta inválida do servidor");

      const dados = response.data;

      let dataFormatada: string = "";

      if (dados.data) {
        // Converte de DD/MM/YYYY para ISO (YYYY-MM-DD), se necessário
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dados.data)) {
          dataFormatada = convertToISODate(dados.data);
        } else if (/^\d{4}-\d{2}-\d{2}$/.test(dados.data)) {
          dataFormatada = dados.data;
        }
      }

      setDadosPreenchidos({
        tipoAtendimentoId: dados.tipoAtendimento?.id || 0,
        datas: dataFormatada ? [dataFormatada] : [],
      });
    } catch (error: any) {
      console.error("Erro ao localizar registro:", error);
      toast.error("Erro ao carregar dados para edição.");
    }
  };




  useEffect(() => {
    fetchTiposAtendimento();
    if (isEditMode && id) {
      chamarFuncao("editar", id);
    }
  }, [id]);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />

        <div className="mb-6">
          <label className="block font-bold mb-2">Tipo de Atendimento</label>
          <select
            className="w-full border rounded p-2"
            value={dadosPreenchidos.tipoAtendimentoId || ""}
            onChange={(e) =>
              setDadosPreenchidos((prev) => ({
                ...prev,
                tipoAtendimentoId: Number(e.target.value),
              }))
            }
          >
            <option value="">Selecione...</option>
            {tiposAtendimento.map((tipo) => (
              <option key={tipo.chave} value={tipo.chave}>
                {tipo.valor}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2">Datas de Atendimento</label>
          <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
            <Calendar
              selectedDates={dadosPreenchidos.datas} // Datas em formato ISO (YYYY-MM-DD)
              onChange={handleDateChange}
            />
          </div>

          {dadosPreenchidos.datas.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="font-medium mb-2">Datas selecionadas:</p>
              <div className="flex flex-wrap gap-2">
                {dadosPreenchidos.datas.map((date, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {parseDateLocal(date).toLocaleDateString("pt-BR")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <Cadastro
          estrutura={estrutura}
          dadosPreenchidos={dadosPreenchidos}
          setDadosPreenchidos={setDadosPreenchidos}
          chamarFuncao={chamarFuncao}
        />
      </div>
    </main>
  );
};

export default withAuthorization(cadastro);