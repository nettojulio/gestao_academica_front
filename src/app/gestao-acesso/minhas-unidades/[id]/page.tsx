"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { generica } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>();
  const [UnidadesPai, setUnidadesPai] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [user, setUser] = useState<any[]>([]);

  const isEditMode = id && id !== "criar";
  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const options = lista.map((item) => ({
      chave: item.id, // ID do item (numérico, por exemplo)
      valor: item.nome, // Texto exibido no <option>
    }));
    if (isEditMode && selecionado) {
      const selectedId = Number(selecionado); // Converte para número, se necessário
      const selectedOption = options.find((opt) => opt.chave === selectedId);
      if (selectedOption) {
        // Coloca a opção selecionada na frente do array
        return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
      }
    }
    return options;
  };
  const estrutura: any = {
    uri: "gestor",
    cabecalho: {
      titulo: isEditMode ? "Alocar Colaborador" : "Alocar Colaborador",
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão Acesso', link: '/gestao-acesso' },
        { nome: "Minhas Unidades", link: "/gestao-acesso/minhas-unidades" },
        {
          nome: isEditMode ? "Visualizar" : "Criar",
          link: `/gestao-acesso/minhas-unidades/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [

        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Colaborador",
          chave: "usuarioId",
          tipo: "select",
          mensagem: "Selecione colaborador",
          obrigatorio: false,
          selectOptions: getOptions(colaboradores, dadosPreenchidos?.usuarioId),
          //exibirPara: ["ALUNO"],

        },


      ],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
      ],
    },
  };

  /**
   * Chama funções de acordo com o botão clicado
   */
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
    router.push("/gestao-acesso/minhas-unidades");
  };

  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */

  const salvarRegistro = async (item: any) => {
    try {
      const unidadeId = Number(id);
      const usuarioId = item.usuarioId;

      if (!unidadeId || !usuarioId) {
        toast.error("É necessário selecionar a unidade e o colaborador!", { position: "top-left" });
        return;
      }

      const body = {
        metodo: "post",
        uri: `/auth/unidade-administrativa/${unidadeId}/funcionarios`,
        params: {},
        data: { usuarioId }, // apenas o ID do colaborador no body
      };

      const response = await generica(body);

      if (!response || response.status < 200 || response.status >= 300) {
        console.error("Status de erro:", response?.status, (response as any)?.statusText || "Status text não disponível");
        toast(`Erro na requisição (HTTP ${response?.status})`, { position: "top-left" });
        return;
      }

      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        Swal.fire({
          title: "Colaborador alocado com sucesso!",
          icon: "success",
          customClass: {
            popup: "my-swal-popup",
            title: "my-swal-title",
            htmlContainer: "my-swal-html",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            chamarFuncao("voltar");
          }
        });
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      toast.error("Erro ao salvar registro. Tente novamente!", { position: "top-left" });
    }
  };



  /**
   * Localiza o registro para edição e preenche os dados
   */
  const editarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: "get",
        uri: "/auth/" + estrutura.uri + "/" + item,
        params: {},
        data: item,
      };

      const response = await generica(body);
      if (!response) {
        throw new Error("Resposta inválida do servidor.");
      }

      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        const data = response.data;
        // data.endereco existe e tem { cep, logradouro, ... }.
        // Precisamos jogar cada um deles para o "top-level" do estado,

        setDadosPreenchidos(data);
      }
    } catch (error) {
      console.error("Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }
  };
  const pesquisarUnidadesAdm = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/' + "unidade-administrativa",
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      // Tratamento de erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else if (response && response.data) {
        // Filtra os itens para manter somente aqueles sem unidade pai (unidadePaiId nulo ou indefinido)
        //const unidadesSemPai = response.data.filter((item: any) => item.unidadePaiId == null || item.unidadePaiId == undefined || item.unidadePaiId == "");
        setUnidadesPai(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  const pesquisarColaboradores = async () => {
    try {
      let tecnicos: any[] = [];
      let professores: any[] = [];

      // Buscar técnicos
      const responseTecnicos = await generica({
        metodo: "get",
        uri: "/auth/tecnico",
        params: { size: 50, page: 0 },
        data: {},
      });

      if (responseTecnicos?.data && !responseTecnicos.data.errors) {
        tecnicos = responseTecnicos.data.content.map((item: any) => ({
          id: item.id,
          nome: item.nome, // ou item.nomeSocial, se preferir
          tipo: "Técnico",
        }));
      }

      // Buscar professores
      const responseProfessores = await generica({
        metodo: "get",
        uri: "/auth/professor",
        params: { size: 50, page: 0 },
        data: {},
      });

      if (responseProfessores?.data && !responseProfessores.data.errors) {
        professores = responseProfessores.data.content.map((item: any) => ({
          id: item.id,
          nome: item.nome, // ou item.nomeSocial, se preferir
          tipo: "Professor",
        }));
      }

      const uniao = [...tecnicos, ...professores];
      setColaboradores(uniao);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
      toast.error("Erro ao carregar colaboradores!", { position: "top-left" });
    }
  };


  const currentUser = async () => {
    try {
      const response = await generica(
        {
          metodo: 'get',
          uri: '/auth/usuario/current',
          data: {}
        }
      );
      if (response?.data?.errors) {
        toast.error("Erro ao carregar dados do usuário!", { position: "top-left" });
      } else {
        setUser(response?.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar dados!', { position: "top-left" });
    }
  };

  // Se estiver em modo de edição, carrega os dados ao montar
  useEffect(() => {
    pesquisarColaboradores();

  }, [id]);


  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />
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
