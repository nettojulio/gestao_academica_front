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
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>([]);
  const [lastMunicipioQuery, setLastMunicipioQuery] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [tipoBeneficioSelecionado, setTipoBeneficioSelecionado] = useState<string | null>(null);
  const [tipoBolsa, setTipoBolsa] = useState<any[]>([]);
  const [estudantes, setEstudantes] = useState<any[]>([]);
  const [tipoAuxilio, setTipoAuxilio] = useState<any[]>([]);
  const isEditMode = id && id !== "criar";

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista)) return [];

    // Mapeia para { chave: id, valor: nome } → Select mostrará "valor" (nome)
    const options = lista.map((item) => ({
      chave: item.id,       // ID (valor salvo no formulário)
      valor: item.nome || item.descricao || item.tipo || item.aluno.nome    // Nome (exibido no select)
    }));

    // Debug: Verifique as opções geradas
    console.log("Opções do select (nome exibido):", options);
    return options;
  };


  const estrutura: any = {
    uri: "auxilio",
    cabecalho: {
      titulo: isEditMode ? "Editar Auxílio" : "Registrar Auxílio",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Auxílios', link: '/prae/auxilio/auxilios' },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/prae/auxilio/auxilios/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        // Linha 1
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Aluno",
          chave: "estudanteId",
          tipo: "select",
          selectOptions: getOptions(estudantes, dadosPreenchidos[0]?.aluno.nome),
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Tipo de Benefício",
          chave: "tipoBeneficio",
          tipo: "select",
          selectOptions: [
            { chave: "auxilio", valor: "Auxílio" },
            { chave: "bolsa", valor: "Bolsa" },
          ],
          mensagem: "Selecione",
          obrigatorio: true,
          bloqueado: isEditMode,
          onChange: (value: string) => setTipoBeneficioSelecionado(value)
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Tipo do Auxílio",
          chave: "tipoAuxilioId",
          tipo: "select",
          selectOptions: getOptions(tipoAuxilio, dadosPreenchidos?.tipo),
          mensagem: "Selecione",
          obrigatorio: false, // Alterado para não obrigatório inicialmente
          bloqueado: isEditMode,
          visivel: tipoBeneficioSelecionado === "auxilio" // Mostrar apenas quando for auxílio
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Valor Auxílio",
          chave: "valorAuxilio",
          tipo: "text",
          mensagem: tipoAuxilio?.filter(tipo => tipo.id == dadosPreenchidos?.tipoAuxilioId)[0]?.valorAuxilio,
          obrigatorio: false, // Alterado para não obrigatório inicialmente
          bloqueado: true,
          visivel: tipoBeneficioSelecionado === "auxilio" && (dadosPreenchidos?.tipoAuxilioId != undefined)
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Tipo da Bolsa",
          chave: "tipoBolsaId",
          tipo: "select",
          selectOptions: getOptions(tipoBolsa, dadosPreenchidos?.tipo),
          mensagem: "Selecione",
          obrigatorio: false, // Alterado para não obrigatório inicialmente
          bloqueado: isEditMode,
          visivel: tipoBeneficioSelecionado === "bolsa" // Mostrar apenas quando for bolsa
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Valor Bolsa",
          chave: "valorBolsa",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          visivel: tipoBeneficioSelecionado === "bolsa"
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Horas da Bolsa",
          chave: "horasBolsa",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Início da Bolsa",
          chave: "inicioBolsa",
          tipo: "date",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Fim da Bolsa",
          chave: "fimBolsa",
          tipo: "date",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Parecer de término",
          chave: "parecerTermino",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },

        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Termo",
          chave: "termo",
          tipo: "documento",
          mensagem: "Digite",
          obrigatorio: true,
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

  const transformarDados = (item: any) => {
    const { valorBolsa, horasBolsa, tipoBolsaId, tipoAuxilioId, ...rest } = item;
    console.log(item)
    return {
      ...rest,
      valorBolsa: isNaN(valorBolsa)? 1: Number(valorBolsa),
      horasBolsa: Number(horasBolsa),
      tipoBolsaId: (tipoBeneficioSelecionado == "auxilio") ? null : Number(tipoBolsaId),
      tipoAuxilioId: (tipoBeneficioSelecionado == "bolsa") ? null : Number(tipoAuxilioId),
    };
  };



  const voltarRegistro = () => {
    router.push("/prae/auxilio/auxilios");
  };



  const pesquisarEstudante = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + 'estudantes',
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
        setEstudantes(response?.data.content);
        console.log("------------------Merda________________________");
        console.log(response?.data.content)
      }

    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };


  const pesquisarTipoAuxilio = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + 'tipo-auxilio',
        //+ '/page',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      console.log('Full response:', dadosPreenchidos);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setTipoAuxilio(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  const pesquisarTipoBolsa = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + 'tipo-bolsa',
        //+ '/page',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      console.log('Full response:', dadosPreenchidos);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setTipoBolsa(response.data);
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
  const salvarRegistro = async (item: any) => {
    const dataToSend = transformarDados(item);
    try {
      const body = {
        metodo: `${isEditMode ? "patch" : "post"}`,
        uri: "/prae/" + `${isEditMode ? estrutura.uri + "/" + item.id : estrutura.uri}`,
        params: {},
        data: dataToSend,
      };
      const response = await generica(body, "multipart/form-data");
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
          title: "Curso salvo com sucesso!",
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


  useEffect(() => {
    if (dadosPreenchidos.tipoBeneficio) {
      setTipoBeneficioSelecionado(dadosPreenchidos.tipoBeneficio);
    }
  }, [dadosPreenchidos.tipoBeneficio]);

  // Filtra os campos com base na visibilidade
  const camposFiltrados = estrutura.cadastro.campos.filter((campo: any) => {
    return campo.visivel === undefined || campo.visivel;
  });

  // Efeito exclusivo para o modo de edição
  useEffect(() => {
    pesquisarTipoBolsa();
    pesquisarTipoAuxilio();
    pesquisarEstudante();
    if (id && id !== "criar") {
      chamarFuncao("editar", id);
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
      </div>
    </main>
  );
};

export default withAuthorization(cadastro);