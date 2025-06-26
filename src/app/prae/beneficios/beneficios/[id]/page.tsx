"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import aplicarMascara from "@/utils/mascaras";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { generica } from "@/utils/api";
import Tabela from "@/components/Tabela/Estrutura";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>([]);
  const [tipoBeneficioSelecionado, setTipoBeneficioSelecionado] = useState<Object | null>(null);
  const [estudanteSelecionado, setEstudanteSelecionado] = useState<Object | null>(null);
  const [estudantes, setEstudantes] = useState<any>({ content: [] });
  const [tipoBeneficio, setTipoBeneficio] = useState<any[]>([]);

  const naturezasBeneficio = [
    { chave: "BOLSA", valor: "Bolsa" },
    { chave: "AUXILIO", valor: "Auxílio" },
    { chave: "ISENCAO", valor: "Isenção" },
    { chave: "OUTROS", valor: "Outros" },
  ];

  useEffect(() => {
    chamarFuncao('pesquisar', null);
  }, []);

  const isEditMode = id && id !== "criar";

  useEffect(() => {
    setTipoBeneficioSelecionado(dadosPreenchidos?.tipoBeneficioId ? tipoBeneficio?.filter(tipo => tipo.id == dadosPreenchidos?.tipoBeneficioId)[0] : null);
  }, [dadosPreenchidos.tipoBeneficioId]);

  useEffect(() => {
    if (dadosPreenchidos.tipoBeneficioId) {
      let valor = tipoBeneficio?.filter(tipo => tipo.id == dadosPreenchidos?.tipoBeneficioId)[0]?.valorBeneficio;
      valor = aplicarMascara(valor, "valor");
      setDadosPreenchidos((prev: any) => ({ ...prev, valorBeneficio: valor }));
    } else {
      setDadosPreenchidos((prev: any) => ({ ...prev, valorBeneficio: undefined }));
    }
  }, [dadosPreenchidos.tipoBeneficioId]);

  // Efeito exclusivo para o modo de edição
  useEffect(() => {
    pesquisarTipoBeneficio();

    if (id && id !== "criar") {
      chamarFuncao("editar", id);
    } else {
      pesquisarEstudantes();
    }
  }, [id]);

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista)) return [];
    const options = lista.map((item) => ({
      chave: item.id,
      valor: item.nome || item.descricao || item.tipo || item.aluno.nome
    }));
    return options;
  };


  const estrutura: any = {
    uri: "beneficio",
    cabecalho: {
      titulo: isEditMode ? "Editar Benefício" : "Registrar Benefício",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Benefícios', link: '/prae/beneficio/beneficios' },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/prae/beneficio/beneficios/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        // Linha 1
        {
          line: 1,
          colSpan: "md:col-span-3",
          nome: "Aluno",
          chave: "estudante",
          tipo: "text",
          bloqueado: true,
          visivel: estudanteSelecionado,
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Remover Estudante",
          tipo: "button",
          funcao: "desselecionarEstudante",
          visivel: estudanteSelecionado && !isEditMode,
        },
        {
          chave: "estudanteId",
          tipo: "number",
          visivel: false,
        },/*
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Natureza do Benefício",
          chave: "naturezasBeneficio",
          tipo: "select",
          selectOptions: naturezasBeneficio,
          mensagem: "Selecione",
          obrigatorio: true,
          bloqueado: isEditMode,
        },*/
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Tipo do Benefício",
          chave: "tipoBeneficioId",
          tipo: "select",
          selectOptions: getOptions(tipoBeneficio, dadosPreenchidos?.tipoBeneficioId),
          mensagem: "Selecione",
          obrigatorio: false, // Alterado para não obrigatório inicialmente
          bloqueado: isEditMode,
          //visivel: tipoBeneficioSelecionado === "beneficio" // Mostrar apenas quando for auxílio
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Valor",
          chave: "valorBeneficio",
          tipo: "text",
          obrigatorio: false,
          bloqueado: true,
          mascara: "valor",
          visivel: dadosPreenchidos?.valorBeneficio != undefined
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Horas da Bolsa",
          chave: "horasBeneficio",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Início da Bolsa",
          chave: "inicioBeneficio",
          tipo: "date",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Fim da Bolsa",
          chave: "fimBeneficio",
          tipo: "date",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Parecer de término",
          chave: "parecerTermino",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: false,
          visivel: isEditMode
        },
        {
          line: 5,
          colSpan: "md:col-span-1",
          nome: "Documentos",
          chave: "documentos",
          tipo: "documento", // ou outro tipo apropriado
          mensagem: "Anexe os documentos",
          obrigatorio: false,
          multiple: false,
          bloqueado: isEditMode,

        },
      ],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
      ],
    },
  };

  const estruturaEstudante: any = {

    uri: "estudantes",

    cabecalho: {
      titulo: "Estudantes",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Estudantes', link: '/prae/estudantes' },
      ]
    },

    tabela: {
      configuracoes: {
        pesquisar: true,
        cabecalho: true,
        rodape: true,
      },
      colunas: [ //colunas da tabela
        { nome: "Nome", chave: "aluno.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
        { nome: "CPF", chave: "aluno.cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
        { nome: "E-mail", chave: "aluno.email", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Curso", chave: "aluno.curso.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Auxílio", chave: "beneficios", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Contato", chave: "aluno.telefone", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
        { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
      ],
      acoes_dropdown: [ //botão de acoes de cada registro
        { nome: 'Selecionar', chave: 'selecionarEstudante' }
      ]
    }

  }

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
      case 'pesquisar':
        pesquisarEstudantes(valor);
        pesquisarTipoBeneficio();
        break;
      case 'selecionarEstudante':
        setEstudanteSelecionado(valor);
        setDadosPreenchidos((prev: any) => ({
          ...prev,
          estudanteId: valor.id,
          estudante: `${valor.aluno.nome} (${valor.aluno.cpf})` ,
        }));
        break;
      case 'desselecionarEstudante':
        setEstudanteSelecionado(null);
        setDadosPreenchidos((prev: any) => ({
          ...prev,
          estudanteId: null,
          estudante: "",
        }));
        break;
      default:
        break;
    }
  };

  function buildFormData(): FormData {
    const fd = new FormData();
    if(!dadosPreenchidos.estudanteId) {
      toast.error("Selecione um estudante antes de salvar o benefício.", { position: "top-right" });
      return null;
    }
    fd.append('estudanteId', dadosPreenchidos.estudanteId.toString());
    if (Array.isArray(dadosPreenchidos.documentos)) {
      dadosPreenchidos.documentos.forEach((file: string | Blob) =>
        fd.append('termo', file)
      );
    }
    fd.append('tipoBeneficioId', dadosPreenchidos.tipoBeneficioId?.toString() || '');
    fd.append('parecerTermino', dadosPreenchidos.parecerTermino || '');
    fd.append('horasBeneficio', dadosPreenchidos.horasBeneficio?.toString() || '');
    fd.append('inicioBeneficio', dadosPreenchidos.inicioBeneficio || '');
    fd.append('fimBeneficio', dadosPreenchidos.fimBeneficio || '');
    fd.append('valorPagamento', tipoBeneficioSelecionado?.valorBeneficio || '0');
    console.log("DEBUG: Dados do FormData:", fd);
    return fd;
  }

  const voltarRegistro = () => {
    router.push("/prae/beneficios/beneficios");
  };



  const pesquisarEstudantes = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/estudantes',
        params: params != null ? params : { size: 10, page: 0 },
        data: {}
      }
      const response = await generica(body);
      console.log(response?.data)
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setEstudantes(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  const pesquisarEstudante = async (idEstudante: Number) => {
    try {
      let body = {
        metodo: 'get',
        uri: `/prae/estudantes/${idEstudante}`,
        data: {}
      }
      const response = await generica(body);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        return response?.data;
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  const pesquisarEstudantesAuxilio = async () => {
    try {
      let body = {
        metodo: 'get',
        uri: `/prae/estudantes/beneficio/${id}`,
        data: {}
      }
      const response = await generica(body);
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        let estudantes = [];
        for (let estudante of response?.data.content) {
          estudantes.push(await pesquisarEstudante(estudante.id));
        }
        chamarFuncao('selecionarEstudante', estudantes[0]);
      }

    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };


  const pesquisarTipoBeneficio = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/' + 'tipo-beneficio',
        //+ '/page',
        params: params != null ? params : { size: 200, page: 0 },
        data: {}
      }
      const response = await generica(body);
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          console.log("DEBUG: Tipo de benefício:", response.data);
          setTipoBeneficio(response.data.content);
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
    const dataToSend = buildFormData();
    if (!dataToSend) {
      return;
    }
    try {
      
      const body = {
        metodo: `${isEditMode ? "patch" : "post"}`,
        uri: "/prae/" + `${isEditMode ? estrutura.uri + "/" + id : estrutura.uri}`,
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
          title: "Benefício salvo com sucesso!",
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
        const beneficio = response.data;
        setDadosPreenchidos({
          tipoBeneficioId: beneficio.tipoBeneficio?.id,
          valorBeneficio: beneficio.tipoBeneficio?.valorBeneficio,
          horasBeneficio: beneficio.horasBeneficio,
          inicioBeneficio: beneficio.inicioBeneficio,
          fimBeneficio: beneficio.fimBeneficio,
          estudanteId: beneficio.estudante?.id,
          parecerTermino: beneficio.parecerTermino,
        });
        setTipoBeneficioSelecionado(beneficio.tipoBeneficio.naturezaBeneficio);
        buscarTermo(Number(id));
        pesquisarEstudantesAuxilio();
      }
    } catch (error) {
      console.error("DEBUG: Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }

  };

  const buscarTermo = async (id: number) => {
    const responseDocumentos = await generica({
      metodo: "get",
      uri: `/prae/${estrutura.uri}/${id}/termo`,
      params: {},
      data: {},
    });
    const docList = responseDocumentos && Array.isArray(responseDocumentos.data)
      ? responseDocumentos.data
      : responseDocumentos?.data
        ? [responseDocumentos.data]
        : [];
    const arquivosConvertidos = docList
      .map((doc: any) => {
        if (doc.base64) {
          const bytes = atob(doc.base64);
          const arr = new Uint8Array(bytes.length);
          for (let i = 0; i < bytes.length; i++) {
            arr[i] = bytes.charCodeAt(i);
          }
          const blob = new Blob([arr], {
            type:
              doc.tipo ??
              (doc.nome?.toLowerCase().endsWith(".pdf")
                ? "application/pdf"
                : "application/octet-stream"),
          });
          return new File([blob], doc.nome ?? "documento", { type: blob.type });
        }
        return null;
      })
      .filter((f) => f !== null) as File[];
    setDadosPreenchidos((prev: any) => ({
      ...prev,
      documentos: arquivosConvertidos,
    }));
  }

  // Filtra os campos com base na visibilidade
  const camposFiltrados = estrutura.cadastro.campos.filter((campo: any) => {
    return campo.visivel === undefined || campo.visivel;
  });

  useEffect(() => {
    chamarFuncao('pesquisar', null);
  }, []);

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full md:w-11/12 lg:w-10/12 2xl:w-3/4 max-w-6xl p-4 pt-10 md:pt-12 md:pb-12">
        <Cabecalho dados={estrutura.cabecalho} />
        {!dadosPreenchidos?.estudanteId && (
          <>
            <h2 className='text-3xl'>Estudantes</h2>
            <Tabela
              dados={estudantes}
              estrutura={estruturaEstudante}
              chamarFuncao={chamarFuncao}
            />
          </>
        )}

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