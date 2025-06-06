"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import Calendar from "@/components/Calendario Cronograma/calendar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { generica } from "@/utils/api";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({ endereco: {} });
  const [tiposAtendimento, setTiposAtendimento] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const isEditMode = id && id !== "criar";

  const fetchTiposAtendimento = async () => {
    try {
      const response = await generica({
        metodo: "get",
        uri: "/prae/tipo-atendimento",
        params: {},
      });
      if (response && response.data) {
        setTiposAtendimento(
          response.data.map((tipo: any) => ({
            chave: tipo.id,
            valor: tipo.nome,
          }))
        );
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de atendimento:", error);
      toast.error("Erro ao carregar tipos de atendimento.", { position: "top-left" });
    }
  };

  useEffect(() => {
    fetchTiposAtendimento();
    if (id && id !== "criar") {
      chamarFuncao("editar", id);
    }
  }, [id]);

  const estrutura: any = {
    uri: "cronograma",
    cabecalho: {
      titulo: isEditMode ? "Editar Cronograma" : "Cadastrar Cronograma",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Cronogramas', link: '/prae/agendamentos/cronograma' },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/prae/agendamentos/cronograma/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        // Removido o campo "Tipo de Atendimento" daqui!
      ],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
      ],
    },
  };

  const chamarFuncao = async (nomeFuncao = "", valor: any = null) => {
    switch (nomeFuncao) {
      case "salvar":
        await salvarRegistro(valor);
        break;
      case "voltar":
        voltarRegistro();
        break;
      case "editar":
        editarRegistro(valor);
        break;
      default:
        break;
    }
  };

  const voltarRegistro = () => {
    router.push("/prae/agendamentos/cronograma");
  };

  const salvarRegistro = async (item: any) => {
    // Usa as datas selecionadas do calendário
    let datasFormatadas: string[] = [];
    if (Array.isArray(selectedDates)) {
      datasFormatadas = selectedDates;
    }

    const dadosFormatados = {
      datas: datasFormatadas,
      tipoAtendimentoId: Number(dadosPreenchidos.tipoAtendimentoId),
    };

    try {
      const body = {
        metodo: `${isEditMode ? "patch" : "post"}`,
        uri: "/prae/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
        params: {},
        data: dadosFormatados,
      };

      const response = await generica(body);

      if (!response || response.status < 200 || response.status >= 300) {
        if (response) {
          console.error(
            "DEBUG: Status de erro:",
            response.status,
            "statusText" in response ? response.statusText : "Sem texto de status"
          );
        }
        toast.error(`Erro na requisição (HTTP ${response?.status || "desconhecido"})`, {
          position: "top-left",
        });
        return;
      }

      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast.error(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast.error(response.data.error.message, { position: "top-left" });
      } else {
        Swal.fire({
          title: "Cronograma salvo com sucesso!",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            chamarFuncao("voltar");
          }
        });
      }
    } catch (error) {
      console.error("DEBUG: Erro ao salvar registro:", error);
      toast.error("Erro ao salvar registro. Tente novamente!", { position: "top-left" });
    }
  };

  const editarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: "get",
        uri: "/prae/" + estrutura.uri + "/" + item,
        params: {},
        data: item,
      };
      const response = await generica(body);
      if (!response) throw new Error("Resposta inválida do servidor.");
      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast.error(response.data.error.message, { position: "top-left" });
      }
      else {
        const dados = response.data;
        if (dados.tipoAtendimento && dados.tipoAtendimento.id) {
          dados.tipoAtendimentoId = dados.tipoAtendimento.id;
        }
        setDadosPreenchidos(dados);
        if (Array.isArray(dados.datas)) {
          setSelectedDates(dados.datas);
        }
      }
    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }
  };

  useEffect(() => {
    if (id && id !== "criar") {
      chamarFuncao("editar", id);
    }
  }, [id]);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />

        {/* Tipo de Atendimento acima do calendário */}
        <div className="mb-6">
          <label className="block font-bold mb-2 text-primary-500">Tipo de Atendimento</label>
          <select
            className="w-full border rounded p-2"
            value={dadosPreenchidos.tipoAtendimentoId || ""}
            onChange={e =>
              setDadosPreenchidos((prev: any) => ({
                ...prev,
                tipoAtendimentoId: e.target.value,
              }))
            }
          >
            <option value="">Selecione...</option>
            {tiposAtendimento.map((tipo: any) => (
              <option key={tipo.chave} value={tipo.chave}>
                {tipo.valor}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-bold mb-2 text-primary-500">Dias do Atendimento</label>
          <Calendar
            onChange={dias => {
              setSelectedDates(dias);
              setDadosPreenchidos((prev: any) => ({
                ...prev,
                datas: dias,
              }));
            }}
          />
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