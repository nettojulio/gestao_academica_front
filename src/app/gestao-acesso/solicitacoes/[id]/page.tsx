"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEnderecoByCep } from "@/utils/brasilianStates";
import { generica } from "@/utils/api";
import Cadastro from "@/components/Cadastro/Estrutura";
import AplicarMascara from "@/utils/mascaras";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
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
    uri: "solicitacao",
    cabecalho: {
      titulo: isEditMode ? "Visualizar Solicitação" : "Solicitar Perfil",
      migalha: [
        { nome: "Home", link: "/gestao-acesso/home" },
        { nome: "Solicitações", link: "/gestao-acesso/solicitacoes" },
        {
          nome: isEditMode ? "visualizar" : "Criar",
          link: `/gestao-acesso/solicitacoes/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Foto Perfil",
          chave: "perfil.fotoPerfil",
          tipo: "foto", // ou outro tipo apropriado
          mensagem: "Anexe os documentos",
          obrigatorio: false,
          bloqueado: isEditMode,

        },
        {

          line: 2,
          colSpan: "md:col-span-1",
          nome: "Tipo de Perfil",
          chave: isEditMode ? "perfil.tipo" : "tipoUsuario",
          tipo: isEditMode ? "text" : "select",
          mensagem: "Selecione o tipo de usuário",
          selectOptions: isEditMode ? null : [
            { chave: "ADMINISTRADOR", valor: "ADMINISTRADOR" },
            { chave: "GESTOR", valor: "GESTOR" },
            { chave: "TECNICO", valor: "TECNICO" },
            { chave: "PROFESSOR", valor: "PROFESSOR" },
            { chave: "ALUNO", valor: "ALUNO" },

          ],
          obrigatorio: true,
          bloqueado: isEditMode,

        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Nome do Solicitante",
          chave: "solicitante.nome",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: isEditMode,

        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome Social",
          chave: "solicitante.nomeSocial",
          tipo: "text",
          mensagem: "Digite o nome social",
          obrigatorio: false,
          bloqueado: isEditMode,

        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Email",
          chave: "solicitante.email",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: isEditMode,

        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "CPF",
          chave: "solicitante.cpf",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: isEditMode,
          mascara: "cpf",
         
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Telefone",
          chave: "solicitante.telefone",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: isEditMode,
          mascara: "celular",

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Matrícula",
          chave: isEditMode ? "perfil.matricula" : "matricula",
          tipo: "text",
          mensagem: "Digite a matrícula",
          obrigatorio: false,
          exibirPara: ["ALUNO"],
          bloqueado: isEditMode,

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Curso",
          chave: isEditMode ? "perfil.curso.nome" : "cursoId",
          tipo: isEditMode ? "select" : "text",
          mensagem: "Selecione o curso",
          obrigatorio: true,
          selectOptions: isEditMode ? null : getOptions(cursos, dadosPreenchidos[0]?.cursoId),
          exibirPara: ["ALUNO"],
          bloqueado: isEditMode,

          // selectOptions: [{ chave: "1", valor: "Engenharia" }, ...]
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Cursos",
          chave: isEditMode ? "perfil.cursos" : "cursoIds",
          tipo: "multi-select",
          mensagem: "Selecione cursos",
          obrigatorio: false,
          exibirPara: ["PROFESSOR"],
          selectOptions: isEditMode ? null : getOptions(cursos, Array.isArray(dadosPreenchidos) && dadosPreenchidos[0]?.cursoIds),
          multiple: true, // Permite selecionar múltiplos cursos
          bloqueado: isEditMode,

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "SIAPE",
          chave: isEditMode ? "perfil.siape" : "siape",
          tipo: "text",
          mensagem: "Digite o SIAPE",
          obrigatorio: true,
          exibirPara: ["ADMINISTRADOR", "GESTOR", "TECNICO", "PROFESSOR"],
          bloqueado: isEditMode,

        },

        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Documentos",
          chave: "documentos",
          tipo: "documento", // ou outro tipo apropriado
          mensagem: "Anexe os documentos",
          obrigatorio: false,
          bloqueado: isEditMode,

        },



      ],
      acoes: [
        { nome: isEditMode ? "Rejeitar" : "Cancelar", chave: isEditMode ? "rejeitar" : "voltar", tipo: "botao" },
        { nome: isEditMode ? "Aprovar" : "Solicitar", chave: isEditMode ? "aprova" : "salvar", tipo: "submit" },
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
      case "visualizar":
        editarRegistro(valor);
        break;
      case "aprovar":
        aprovarRegistro(valor);
        break;
      case "rejeitar":
        rejeitarRegistro(valor);
        break;
      default:
        break;
    }
  };

  const voltarRegistro = () => {
    router.push("/gestao-acesso/solicitacoes");
  };
  const pesquisarRegistroCursos = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/curso',
        //+ '/page',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setCursos(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };
  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const rejeitarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: "post",
        uri: "/auth/" + estrutura.uri +"/"+ item.id +"/rejeitar",
        params: {},
        data: item,
      };
      const response = await generica(body);
      if (!response || response.status < 200 || response.status >= 300) {
        if (response) {
          console.error("DEBUG: Status de erro:", response.status, 'statusText' in response ? response.statusText : "Sem texto de status");
        }
        toast.error(`Erro na requisição (HTTP ${response?.status || "desconhecido"})`, { position: "top-left" });
        return;
      }
      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast.error(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        Swal.fire({
          title: "Solicitação enviada com sucesso!",
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
  const aprovarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: "post",
        uri: "/auth/" + estrutura.uri+"/"+item.id + "/aprovar",
        params: {},
        data: item,
      };
      const response = await generica(body);
      if (!response || response.status < 200 || response.status >= 300) {
        if (response) {
          console.error("DEBUG: Status de erro:", response.status, 'statusText' in response ? response.statusText : "Sem texto de status");
        }
        toast.error(`Erro na requisição (HTTP ${response?.status || "desconhecido"})`, { position: "top-left" });
        return;
      }
      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast.error(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        Swal.fire({
          title: "Solicitação enviada com sucesso!",
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
  const salvarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: "post",
        uri: "/auth/" + estrutura.uri + "/" + item.tipoUsuario.toLowerCase(),
        params: {},
        data: item,
      };
      console.log(body)
      const response = await generica(body);
      if (!response || response.status < 200 || response.status >= 300) {
        if (response) {
          console.error("DEBUG: Status de erro:", response.status, 'statusText' in response ? response.statusText : "Sem texto de status");
        }
        toast.error(`Erro na requisição (HTTP ${response?.status || "desconhecido"})`, { position: "top-left" });
        return;
      }
      if (response.data?.errors) {
        Object.keys(response.data.errors).forEach((campoErro) => {
          toast.error(`Erro em ${campoErro}: ${response.data.errors[campoErro]}`, {
            position: "top-left",
          });
        });
      } else if (response.data?.error) {
        toast(response.data.error.message, { position: "top-left" });
      } else {
        Swal.fire({
          title: "Solicitação enviada com sucesso!",
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

  /**
   * Localiza o registro para edição e preenche os dados
   */
// Exemplo assumindo que "campo.chave" === "documentos"
const editarRegistro = async (item: any) => {
  try {
    // 1) Carrega a solicitação principal
    const bodySolicitacao = {
      metodo: "get",
      uri: `/auth/${estrutura.uri}/${item}`,
      params: {},
      data: {},
    };
    const responseSolicitacao = await generica(bodySolicitacao);

    // Verifica se houve retorno válido
    if (!responseSolicitacao || !responseSolicitacao.data) {
      throw new Error("Resposta inválida do servidor para solicitação.");
    }

    // Trata erros vindos do back-end
    if (responseSolicitacao.data.errors) {
      Object.keys(responseSolicitacao.data.errors).forEach((campoErro) => {
        toast.error(
          `Erro em ${campoErro}: ${responseSolicitacao.data.errors[campoErro]}`,
          { position: "top-left" }
        );
      });
      return;
    } else if (responseSolicitacao.data.error) {
      toast.error(responseSolicitacao.data.error.message, {
        position: "top-left",
      });
      return;
    }

    // Atualiza o estado com os dados da solicitação
    setDadosPreenchidos(responseSolicitacao.data);

    // 2) Agora carrega os documentos
    const bodyDocumentos = {
      metodo: "get",
      uri: `/auth/${estrutura.uri}/${item}/documentos`,
      params: {},
      data: {},
    };
    const responseDocumentos = await generica(bodyDocumentos);

    if (!responseDocumentos || !responseDocumentos.data) {
      throw new Error("Resposta inválida do servidor para documentos.");
    }

    if (responseDocumentos.data.errors) {
      Object.keys(responseDocumentos.data.errors).forEach((campoErro) => {
        toast.error(
          `Erro em ${campoErro}: ${responseDocumentos.data.errors[campoErro]}`,
          { position: "top-left" }
        );
      });
      return;
    } else if (responseDocumentos.data.error) {
      toast.error(responseDocumentos.data.error.message, {
        position: "top-left",
      });
      return;
    }

    // Caso o data dos documentos não seja um array, converte para array
    const docList = Array.isArray(responseDocumentos.data)
      ? responseDocumentos.data
      : [responseDocumentos.data];

    // Converte cada documento para o formato File utilizando Blob (se houver base64)
    const arquivosConvertidos = docList.map((doc: any) => {
      if (doc.conteudoBase64) {
        try {
          // Converte a string base64 em bytes
          const byteCharacters = atob(doc.conteudoBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
    
          // Cria um Blob a partir do array de bytes
          const blob = new Blob([byteArray], { type: doc.tipo });
          
          // Cria um objeto File a partir do Blob
          return new File([blob], doc.nome, { type: doc.tipo });
        } catch (error) {
          console.error("Erro ao converter base64 para File:", error);
          // Caso ocorra um erro, pode retornar o próprio doc ou tratar de outra forma
          return doc;
        }
      }
      // Se não houver 'conteudoBase64', retorne o documento conforme recebido
      return doc;
    });
    

    // Atualiza o estado já com os arquivos convertidos
    // Usando "documentos" como chave (assumindo que seu campo.chave === "documentos")
    setDadosPreenchidos((prev: any) => ({
      ...prev,
      documentos: arquivosConvertidos,
    }));

    console.log("Documentos carregados:", arquivosConvertidos);
  } catch (error) {
    console.error("DEBUG: Erro ao localizar registro:", error);
    toast.error("Erro ao localizar registro. Tente novamente!", {
      position: "top-left",
    });
  }
};

  

  // Efeito exclusivo para o modo de edição
  useEffect(() => {
    pesquisarRegistroCursos();

    if (id && id !== "criar") {
      chamarFuncao("visualizar", id);
    }

    console.log(dadosPreenchidos)

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