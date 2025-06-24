"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import Tabela from "@/components/Tabela/Estrutura";
import { useRole } from "@/context/roleContext";
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
  const [dadosTabela, setDadosTabela] = useState<any>({});

  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [UnidadesPai, setUnidadesPai] = useState<any[]>([]);
  const [tipoUnidade, setTipoUnidade] = useState<any[]>([]);
  const { activeRole, userRoles } = useRole();
  const isPrivileged = activeRole;//activeRole === "administrador" || activeRole === "gestor";

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
    uri: "unidade-administrativa",
    cabecalho: {
      titulo: isEditMode ? "Editar Unidade Administrativa" : "Cadastrar Unidade Administrativa",
      migalha: [
        { nome: 'Início', link: '/home' },
        { nome: 'Gestão de Acesso', link: '/gestao-acesso' },
        { nome: "Unidades Administrativas", link: "/gestao-acesso/unidades-administrativas" },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/gestao-acesso/unidades-administrativas/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    tabela: {
      configuracoes: {
        pesquisar: true,
        cabecalho: true,
        rodape: true,
      },
      botoes: isEditMode ? [ // Mostra botão apenas no modo edição
        { nome: 'Adicionar', chave: 'adicionar', bloqueado: false },
      ] : [],
      //Ajustar coluna com as colunas de gestores
      colunas: [ // <-- já define as colunas aqui!
        { nome: "CPF", chave: "cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Nome", chave: "nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "E-mail", chave: "email", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Siape", chave: "siape", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Telefone", chave: "telefone", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      ],
      acoes_dropdown: [
        { nome: 'Editar', chave: 'editar' },
        { nome: 'Deletar', chave: 'deletar' },
      ],
    },
    cadastro: {
      campos: [
        // Linha 1
        {
          line: 1,
          colSpan: "md:col-span-2",
          nome: "Nome",
          chave: "nome",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Código",
          chave: "codigo",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },

        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: (
            <>
              Tipo Unidade <span className="text-red-500">*</span>
            </>
          ),
          chave: "tipoUnidadeAdministrativaId",
          tipo: "select",
          mensagem: "Selecione a unidade responsavel",
          obrigatorio: false,
          selectOptions: getOptions(tipoUnidade, dadosPreenchidos?.tipoUnidadeAdministrativaId),
          //exibirPara: ["ALUNO"],
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Unidade Administrativa Responsavel",
          chave: "unidadePaiId",
          tipo: "select",
          mensagem: "Selecione a unidade responsavel",
          obrigatorio: false,
          selectOptions: getOptions(UnidadesPai, dadosPreenchidos?.unidadePaiId),
          //exibirPara: ["ALUNO"],
        }

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
      case 'adicionar':
        adicionarGestor(valor);
        break;
      default:
        break;
    }
  };
  const adicionarGestor = (idUnidade: string) => {
    if (!idUnidade) {
      console.error("ID da unidade não fornecido");
      return;
    }

    const rota = activeRole === "administrador"
      ? `/gestao-acesso/alocar-gestor/${isEditMode ? id : "criar"}`
      : `/gestao-acesso/alocar-colaborador/${isEditMode ? id : "criar"}`;

    router.push(rota);
  };
  const voltarRegistro = () => {
    router.push("/gestao-acesso/unidades-administrativas");
  };

  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const salvarRegistro = async (item: any) => {
    try {

      const dadosParaEnviar = {
        nome: item.nome,
        codigo: item.codigo,
        tipoUnidadeAdministrativaId: item.tipoUnidadeAdministrativaId,
        unidadePaiId: item.unidadePaiId,
      };

      if (item.unidadePaiId !== undefined && item.unidadePaiId !== null) {
        dadosParaEnviar.unidadePaiId = item.unidadePaiId;
      }

      const body = {
        metodo: `${isEditMode ? "patch" : "post"}`,
        uri: "/auth/" + (isEditMode ? `${estrutura.uri}/${id}` : estrutura.uri),
        params: {},
        data: dadosParaEnviar,
      };

      const response = await generica(body);

      // 1) Checar se deu erro no status da resposta
      //    (isso depende de como 'generica' retorna as informações).
      // Exemplo com Axios:
      if (!response || response.status < 200 || response.status >= 300) {
        // Se cair aqui, é porque o status não foi 2xx
        console.error("Status de erro:", response?.status, (response as any)?.statusText || "Status text não disponível");
        if (response) {
          toast(`Erro na requisição (HTTP ${response.status})`, { position: "top-left" });
        } else {
          toast("Erro na requisição: resposta nula", { position: "top-left" });
        }
        return;
      }

      // 2) Checar se existe 'errors' ou 'error' no body
      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        // 3) Se chegou até aqui, é realmente sucesso
        Swal.fire({
          title: "Unidade gestora salvo com sucesso!",
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


  //Corrigir a consulta para gestores
  const pesquisarGestores = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/' + "gestor",
        //+ '/page',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast.error("Erro. Tente novamente!", { position: "top-left" });
      } else if (response && response.data && response.data.error != undefined) {
        if (response && response.data && response.data.error) {
          toast(response.data.error.message, { position: "top-left" });
        }
      } else {
        if (response && response.data) {
          setDadosTabela(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  const pesquisarColaborador = async () => {
    try {
      let tecnicos: any[] = [];
      let professores: any[] = [];

      // Buscar técnicos
      const responseTecnicos = await generica({
        metodo: "get",
        uri: "/auth/tecnico",
        params: { size: 10, page: 0 },
        data: {},
      });

      if (responseTecnicos?.data && !responseTecnicos.data.errors) {
        tecnicos = responseTecnicos.data.content.map((item: any) => ({
          ...item,
          tipo: "Técnico",
        }));
      }

      // Buscar professores
      const responseProfessores = await generica({
        metodo: "get",
        uri: "/auth/professor",
        params: { size: 10, page: 0 },
        data: {},
      });

      if (responseProfessores?.data && !responseProfessores.data.errors) {
        professores = responseProfessores.data.content.map((item: any) => ({
          ...item,
          tipo: "Professor",
        }));
      }

      const uniao = [...tecnicos, ...professores];

      // Adaptando para o formato esperado pela Tabela
      const dadosAdaptados = {
        content: uniao,
        pageable: {
          pageNumber: 0,
          pageSize: 20,
        },
        totalElements: uniao.length,
        totalPages: 1,
        number: 0,
        size: 50,
        sort: { sorted: false, unsorted: true, empty: true },
        numberOfElements: uniao.length,
        first: true,
        last: true,
        empty: false,
      };

      setDadosTabela(dadosAdaptados);
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
      toast.error("Erro ao carregar colaboradores!", { position: "top-left" });
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
      if (!response) throw new Error("Resposta inválida do servidor.");
      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast.error(response.data.error.message, { position: "top-left" });
      } else {
        setDadosPreenchidos(response.data);
      }
    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }
  };
  const pesquisarUnidadesPai = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/' + estrutura.uri + "",
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
  const pesquisarTipoUnidades = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/tipo-unidade-administrativa',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      };
      const response = await generica(body);

      if (response?.data?.errors) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response?.data?.error) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else if (response?.data?.content) { // Acessando 'content'
        setTipoUnidade(response.data.content); // Passa apenas o array de itens
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  // Se estiver em modo de edição, carrega os dados ao montar
  useEffect(() => {
    pesquisarTipoUnidades();
    pesquisarUnidadesPai();

    if (activeRole === "administrador") {
      pesquisarGestores();
    } else {
      pesquisarColaborador(); // aqui está o correto
    }

    if (id && id !== "criar") {
      chamarFuncao("editar", id);
    }
  }, [id, activeRole]);




  return (
    <main className="flex flex-wrap justify-center mx-auto">
      {/* Container principal (mesmo padrão do primeiro exemplo) */}
      <div className="w-full max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-6">
        {/* Seção de Cadastro */}
        <div className="rounded-lg shadow-sm p-4 md:p-6">
          <Cabecalho dados={estrutura.cabecalho} />
          <Cadastro
            estrutura={estrutura}
            dadosPreenchidos={dadosPreenchidos}
            setDadosPreenchidos={setDadosPreenchidos}
            chamarFuncao={chamarFuncao}
          />
        </div>

        {/* Seção Condicional (Tabela) */}
        {isEditMode && (  // ← Renderiza apenas se isEditMode = true
          <div className="rounded-lg shadow-sm p-4 md:p-6 mt-6">
            <span className="block text-center text-2xl font-semibold mb-4">
              {isPrivileged === "administrador"
                ? "Consultar Gestores"
                : "Consultar Colaborador"}
            </span>
            <Tabela
              dados={dadosTabela}
              estrutura={estrutura}
              chamarFuncao={chamarFuncao}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default withAuthorization(cadastro);