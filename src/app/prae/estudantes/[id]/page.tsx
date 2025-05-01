"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEnderecoByCep } from "@/utils/brasilianStates";
import { generica } from "@/utils/api";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({ endereco: {} });
  const [cursos, setCursos] = useState<any[]>([]);
  const [lastMunicipioQuery, setLastMunicipioQuery] = useState("");
  const [etnia, setEtnia] = useState<any[]>([]);
  const isEditMode = id && id !== "criar";

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista)) return [];
    
    // Mapeia para { chave: id, valor: nome } → Select mostrará "valor" (nome)
    const options = lista.map((item) => ({
      chave: item.id,       // ID (valor salvo no formulário)
      valor: item.nome || item.tipo     // Nome (exibido no select)
    }));
  
    // Debug: Verifique as opções geradas
    console.log("Opções do select (nome exibido):", options);
    return options;
  };

  const estrutura: any = {
    uri: "estudantes",
    cabecalho: {
      titulo: isEditMode ? "Editar Curso" : "Cadastrar Estudantes",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Pagamentos', link: '/prae/pagamentos' },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/prae/pagamentos/${isEditMode ? id : "criar"}`,
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
          nome: "Nome do Solicitante",
          chave: "nome",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome Social",
          chave: "nomeSocial",
          tipo: "text",
          mensagem: "Digite o nome social",
          obrigatorio: false,
          bloqueado: true,

        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Email",
          chave: "email",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,

        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "CPF",
          chave: "cpf",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          mascara: "cpf",
         
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Telefone",
          chave: "telefone",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          mascara: "celular",

        },
        {
          line: 3,
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
          line: 3,
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
          line: 3,
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
          line: 3,
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
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Etnia",
          chave: "tipoEtnia", // Campo onde o ID será salvo
          tipo: "select",
          mensagem: "Selecione a opção",
          obrigatorio: true,
          selectOptions: getOptions(etnia, dadosPreenchidos?.tipoEtnia),
          // Adicione estas props para controlar a exibição:
          opcaoChave: "chave",   // Campo usado como valor (ID)
          opcaoValor: "valor",   // Campo exibido no select (nome/tipo)
          bloqueado: isEditMode,
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Renda Percapita",
          chave: isEditMode ? "perfil.siape" : "rendaPercapita",
          tipo: "text",
          mensagem: "Digite a renda percápita",
          obrigatorio: true,
          bloqueado: isEditMode,
          mascara: "valor",
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Conta Bancaria",
          chave: isEditMode ? "dadosBancarios.conta" : "dadosBancarios.conta",
          tipo: "text",
          mensagem: "Digite a renda percápita",
          obrigatorio: true,
          bloqueado: isEditMode,
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Agencia Bancaria",
          chave: isEditMode ? "dadosBancarios.agencia" : "dadosBancarios.agencia",
          tipo: "text",
          mensagem: "Digite a renda percápita",
          obrigatorio: true,
          bloqueado: isEditMode,
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Conta Bancaria",
          chave: isEditMode ? "perfil.siape" : "rendaPercapita",
          tipo: "text",
          mensagem: "Digite a renda percápita",
          obrigatorio: true,
          bloqueado: isEditMode,
          mascara: "valor",
        },
        {
          line: 6,
          colSpan: "md:col-span-1",
          nome: "Contato Familiar",
          chave: isEditMode ? "contatoFamiliar" : "contatoFamiliar",
          tipo: "text",
          mensagem: "Digite o contato familiar",
          obrigatorio: true,
          bloqueado: isEditMode,
          mascara: "celular",
        },
        {
          line: 6,
          colSpan: "md:col-span-1",
          nome: "É portador de Deficiência",
          chave: isEditMode ? "deficiencia" : "deficiencia",
          tipo: "select",
          selectOptions: [
            { chave: true, valor: "Sim" },
            { chave: false, valor: "Não" },
          ],
          mensagem: "Selecione a opção",
          obrigatorio: true,
          bloqueado: isEditMode,
          mascara: "valor",
        },
        {
          line: 6,
          colSpan: "md:col-span-1",
          nome: "Se sim, qual deficiência",
          chave: isEditMode ? "tipoDeficiencia" : "tipoDeficiencia",
          tipo: "text",
          mensagem: "Qual o tipo da deficiência",
          obrigatorio: true,
          bloqueado: isEditMode,
        },
        {
          line: 7,
          colSpan: "md:col-span-1",
          nome: "Laudo Médico",
          chave: isEditMode ? "laudo" : "laudo",
          tipo: "documento",
          bloqueado: isEditMode,
        },
      ],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
      ],
    },
  };


  const currentUser = async (params = null) => {
      try {
        let body = {
          metodo: 'get',
          uri: '/auth/usuario/current',
          //+ '/page',
          params: params != null ? params : { size: 25, page: 0 },
          data: {}
        }
        const response = await generica(body);
        //tratamento dos erros
        if (response && response.data.errors != undefined) {
          toast("Erro. Tente novamente!", { position: "top-left" });
        } else if (response && response.data.error != undefined) {
          toast(response.data.error.message, { position: "top-left" });
        } else {
          if (response && response.data) {
            setDadosPreenchidos(response.data);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar registros:', error);
      }
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

const pesquisarEtnia = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + 'tipoEtnia',
        //+ '/page',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      console.log('Dados de etnia recebidos:', response);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setEtnia(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  const voltarRegistro = () => {
    router.push("/prae/pagamentos");
  };

  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const salvarRegistro = async (item: any) => {
    try {
      const body = {
        metodo: `${isEditMode ? "patch" : "post"}`,
        uri: "/prae/" + `${isEditMode ? estrutura.uri+"/"+ item.id : estrutura.uri}`,
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
          title: "Pagamento registrado com sucesso!",
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
      } else {       
        setDadosPreenchidos(response.data);
      }
    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }
  };

  // Efeito exclusivo para o modo de edição
  useEffect(() => {
    currentUser();
    pesquisarEtnia();

    if (id && id !== "criar") {
      chamarFuncao("editar", id);
    }
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