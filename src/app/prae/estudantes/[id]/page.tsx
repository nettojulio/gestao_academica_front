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
import AuthTokenService from "@/app/authentication/auth.token";
import React from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";


const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isGestor, setIsGestor] = useState<boolean>(false);
  const [isAluno, setisAluno] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<string>("");
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({ endereco: {} });
  const [dadosForm, setDadosForm] = useState<any>({ endereco: {} });
  const [dadosBancariosPreenchidos, setDadosBancariosPreenchidos] = useState<any>({});
  const [dadosBancariosForm, setDadosBancariosForm] = useState<any>({});
  const [cursos, setCursos] = useState<any[]>([]);
  const [etnia, setEtnia] = useState<any[]>([]);
  const [isDeficiente, setIsDeficiente] = useState<boolean>(false);
  const isEditMode = id && id !== "criar";

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista)) return [];

    // Mapeia para { chave: id, valor: nome } → Select mostrará "valor" (nome)
    const options = lista.map((item) => ({
      chave: item.id,       // ID (valor salvo no formulário)
      valor: item.nome || item.tipo     // Nome (exibido no select)
    }));

    // Debug: Verifique as opções geradas
    return options;
  };

  const estrutura: any = {
    uri: "estudantes",
    cabecalho: {
      titulo: isEditMode ? "Editar Estudante" : "Cadastrar Estudante",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Estudantes', link: '/prae/estudantes' },
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
          tipo: "foto",
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
          obrigatorio: isEditMode ? false : true,
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
          nome: "E-mail",
          chave: "email",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: isEditMode ? false : true,
          bloqueado: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "CPF",
          chave: "cpf",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: isEditMode ? false : true,
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
          obrigatorio: isEditMode ? false : true,
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
          obrigatorio: isEditMode ? false : true,
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
          obrigatorio: isEditMode ? false : true,
          selectOptions: isEditMode ? null : getOptions(cursos, dadosPreenchidos[0]?.cursoId),
          exibirPara: ["ALUNO"],
          bloqueado: isEditMode,
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
          multiple: true,
          bloqueado: isEditMode,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "SIAPE",
          chave: isEditMode ? "perfil.siape" : "siape",
          tipo: "text",
          mensagem: "Digite o SIAPE",
          obrigatorio: isEditMode ? false : true,
          exibirPara: ["ADMINISTRADOR", "GESTOR", "TECNICO", "PROFESSOR"],
          bloqueado: isEditMode,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Etnia",
          chave: "tipoEtniaId",
          tipo: "select",
          mensagem: "Selecione a opção",
          obrigatorio: isEditMode ? false : true,
          selectOptions: getOptions(etnia, dadosPreenchidos?.tipoEtniaId),
          opcaoChave: "chave",
          opcaoValor: "valor",
          bloqueado: isEditMode ? true : false,
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Renda Per Capta",
          chave: isEditMode ? "rendaPercapta" : "rendaPercapta",
          tipo: "text",
          mensagem: "Digite a renda percápita",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
          mascara: "valor",
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "CEP",
          chave: isEditMode ? "cep" : "cep",
          tipo: "text",
          mensagem: "Digite o CEP",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
          mascara: "CEP",
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Rua",
          chave: isEditMode ? "rua" : "rua",
          tipo: "text",
          mensagem: "Digite o nome da rua",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Bairro",
          chave: isEditMode ? "bairro" : "bairro",
          tipo: "text",
          mensagem: "Digite o bairro",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Cidade",
          chave: isEditMode ? "cidade" : "cidade",
          tipo: "text",
          mensagem: "Digite a cidade",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Estado",
          chave: isEditMode ? "estado" : "estado",
          tipo: "text",
          mensagem: "Digite o estado",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Número",
          chave: isEditMode ? "numero" : "numero",
          tipo: "text",
          mensagem: "Digite o numero",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Complemento",
          chave: isEditMode ? "complemento" : "complemento",
          tipo: "text",
          mensagem: "Digite o complemento",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
        {
          line: 6,
          colSpan: "md:col-span-1",
          nome: "Contato Familiar",
          chave: isEditMode ? "contatoFamilia" : "contatoFamilia",
          tipo: "text",
          mensagem: "Digite o contato familiar",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
          mascara: "celular",
        },
        {
          line: 6,
          colSpan: "md:col-span-1",
          nome: "É portador de Deficiência",
          chave: "deficiente",
          tipo: "select",
          selectOptions: [
            { chave: true, valor: "Sim" },
            { chave: false, valor: "Não" },
          ],
          mensagem: "Selecione a opção",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
          mascara: "valor",
        },
        {
          line: 6,
          colSpan: "md:col-span-1",
          nome: "Se sim, qual deficiência",
          chave: "tipoDeficiencia",
          tipo: "text",
          mensagem: "Qual o tipo da deficiência",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
        {
          line: 7,
          colSpan: "md:col-span-1",
          nome: "Laudo Médico",
          chave: "laudo",
          tipo: "documento",
          obrigatorio: isEditMode ? false : true,
          bloqueado: isEditMode,
        },
      ],
      acoes: isAluno ? [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" }
      ] :
        [],
    },
  };

  const estruturaDadosBancarios: any = {
    uri: "dadosBancarios",
    cabecalho: {
      titulo: isEditMode ? "Editar Dados Bancários" : "Cadastrar Dados Bancários",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Dados Bancários', link: '/prae/dados-bancarios' },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/prae/dados-bancarios/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Titular",
          chave: "nomeTitular",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Banco",
          chave: "banco",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Tipo de Conta",
          chave: "tipoConta",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Conta Bancária",
          chave: "conta",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Agencia Bancária",
          chave: "agencia",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
      ],
      acoes: isGestor ? [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: dadosPreenchidos?.dadosBancarios ? "Salvar" : "Cadastrar", chave: "salvarDadosBancarios", tipo: "submit" }
      ] :
        [{ nome: "Voltar", chave: "voltar", tipo: "botao" }],
    },
  };

  // Sincroniza isDeficiente com o valor selecionado em dadosPreenchidos.deficiente
  useEffect(() => {
    setIsDeficiente(
      dadosPreenchidos.deficiente === true ||
      dadosPreenchidos.deficiente === "true"
    );
  }, [dadosPreenchidos.deficiente]);

  // Filtra os campos 'tipoDeficiencia' e 'laudo' com base em isDeficiente
  const camposFiltrados = estrutura.cadastro.campos.filter((campo: any) => {
    if (campo.chave === "tipoDeficiencia" || campo.chave === "laudo") {
      return isDeficiente;
    }
    return true;
  });

  const currentUser = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/auth/usuario/current',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      };
      const response = await generica(body);
      if (response && response.data) {
        setDadosPreenchidos(response.data);
        console.log("----------------------Aqui, viado---------------------");
        console.log("Dados do usuário atual:", response.data);
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
      case "salvarDadosBancarios":
        await salvarRegistroDadosBancarios(valor);
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
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      };
      const response = await generica(body);
      if (response && response.data) {
        setEtnia(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  const voltarRegistro = () => {
    router.push("/prae/estudantes");
  };

  const transformarDados = (item: any) => {
    const { cep, rua, complemento, numero, bairro, cidade, estado, tipoEtniaId, rendaPercapta, ...rest } = item;
    return {
      ...rest,
      endereco: { cep, rua, complemento, numero, bairro, cidade, estado },
      tipoEtniaId: Number(tipoEtniaId),
      rendaPercapta: Number(rendaPercapta)
    };
  };

  const endereco = useEnderecoByCep(dadosForm?.cep || "");

  useEffect(() => {
    if (endereco) {
      setDadosPreenchidos((prev: any) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: endereco.cep || prev.endereco?.cep || '',
          rua: prev.endereco?.rua || '',
          bairro: endereco.bairro || prev.endereco?.bairro || '',
          cidade: prev.endereco?.cidade || '',
          estado: endereco.estado || prev.endereco?.estado || '',
          complemento: prev.endereco?.complemento || '',
          numero: prev.endereco?.numero || '',
        }
      }));
      console.log("Dados retornados pelo hook useEnderecoByCep:", endereco);
    }
  }, [endereco]);

  useEffect(() => {
    const authenticated = AuthTokenService.isAuthenticated(true);
    setIsAuthenticated(authenticated);

    if (authenticated) {
      const roles: string[] = [];
      if (AuthTokenService.isAdmin(false)) roles.push("administrador");
      if (AuthTokenService.isGestor(false)) { roles.push("gestor"); setIsGestor(true); }
      if (AuthTokenService.isTecnico(false)) roles.push("tecnico");
      if (AuthTokenService.isProfessor(false)) roles.push("professor");
      if (AuthTokenService.isAluno(false)) { roles.push("aluno"); setisAluno(true); }
      if (AuthTokenService.isVisitante(false)) roles.push("visitante");
      setUserRoles(roles);

      if (roles.length > 0 && activeRole === "") {
        setActiveRole(roles[0]);
      }
    } else {
      setUserRoles([]);
      setActiveRole("");
    }
  }, [isAuthenticated]);


  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const salvarRegistro = async (item: any) => {
    try {
      const dataToSend = transformarDados(item);
      const body = {
        metodo: `${isEditMode ? "patch" : "post"}`,
        uri: "/prae/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
        params: {},
        data: dataToSend,
      };
      const response = await generica(body);
      if (!response || response.status < 200 || response.status >= 300) {
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
          title: "Aluno registrado com sucesso!",
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

  const salvarRegistroDadosBancarios = async (item: any) => {
    try {
      const dataToSend = dadosBancariosPreenchidos;
      console.log("aqui", item)
      const body = {
        metodo: `${dadosPreenchidos?.dadosBancarios ? "patch" : "post"}`,
        uri: "/prae/" + `${dadosPreenchidos?.dadosBancarios ? estruturaDadosBancarios.uri + "/" + item.id : estruturaDadosBancarios.uri + "/" + dadosPreenchidos.id}`,
        params: {},
        data: dataToSend,
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
          title: "Dados bancarios salvo com sucesso!",
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
        setDadosPreenchidos({
          ...response.data,
          nome: response.data.aluno.nome,
          nomeSocial: response.data.aluno.nomeSocial,
          email: response.data.aluno.email,
          cpf: response.data.aluno.cpf,
          telefone: response.data.aluno.telefone,
          etnia: response.data.tipoEtnia,
          cep: response.data.endereco.cep,
          rua: response.data.endereco.rua,
          cidade: response.data.endereco.cidade,
          estado: response.data.endereco.estado,
          numero: response.data.endereco.numero,
          complemento: response.data.endereco.complemento,
          bairro: response.data.endereco.bairro,
          tipoEtniaId: response.data.tipoEtnia.id,
        });
        if (response.data?.dadosBancarios) {
          setDadosBancariosPreenchidos(response.data.dadosBancarios);
        }
      }
    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }
  };

  // Efeito exclusivo para o modo de edição
  useEffect(() => {
    pesquisarEtnia();
    if (id && id !== "criar") {
      chamarFuncao("editar", id);
    } else {
      if (isAluno)
      currentUser();
    }
  }, [id]);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />
        <Cadastro
          estrutura={{
            ...estrutura,
            cadastro: {
              ...estrutura.cadastro,
              campos: camposFiltrados
            }
          }}
          dadosPreenchidos={dadosPreenchidos}
          setDadosPreenchidos={setDadosPreenchidos}
          chamarFuncao={chamarFuncao}
        />
        {isGestor && (
          <div className="mt-10">
            <h2 className='text-3xl'>Dados Bancários</h2>
            <Cadastro
              estrutura={estruturaDadosBancarios}
              dadosPreenchidos={dadosBancariosPreenchidos}
              setDadosPreenchidos={setDadosBancariosPreenchidos}
              chamarFuncao={chamarFuncao}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default withAuthorization(cadastro);