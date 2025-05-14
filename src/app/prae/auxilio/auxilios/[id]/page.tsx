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
  const [tipoBolsa, setTipoBolsa] = useState<any[]>([]);
  const isEditMode = id && id !== "criar";

  const getOptions = (lista: any[], selecionado: any) => {
        if (!Array.isArray(lista) || lista.length === 0) return [];
        const options = lista.map((item) => ({
            chave: item.id,
            valor: item.descricao // Texto exibido no <option>
        }));
        if (isEditMode && selecionado) {
            const selectedId = Number(selecionado);
            const selectedOption = options.find((opt) => opt.chave === selectedId);
            if (selectedOption) {
                return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
            }
        }
        return options;
    };

  const estrutura: any = {
    uri: "auxilio",
    cabecalho: {
      titulo: isEditMode ? "Editar Auxilio" : "Registrar Auxilio",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Prae', link: '/prae' },
        { nome: 'Auxilios', link: '/prae/auxilio/auxilios' },
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
          nome: "Tipo do Auxilio ID",
          chave: "tipoAuxilioId",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Tipo da Bolsa",
          chave: "tipoBolsaId",
          tipo: "select",
          selectOptions: getOptions(tipoBolsa, dadosPreenchidos[0]?.tipo),
          mensagem: "Selecione",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Valor Bolsa",
          chave: "valorBolsa",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Horas da Bolsa",
          chave: "horasBolsa",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          mascara: "horas",
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Inicio da Bolsa",
          chave: "inicioBolsa",
          tipo: "date",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Fim da Bolsa",
          chave: "fimBolsa",
          tipo: "date",
          mensagem: "Digite",
          obrigatorio: true,
        },
        
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Status",
          chave: "statys",
          tipo: "bolean",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Parecer de termino",
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
    return { ...rest, valorBolsa: Number(valorBolsa), horasBolsa: Number(horasBolsa), tipoBolsaId: Number(tipoBolsaId), tipoAuxilioId: Number(tipoAuxilioId) };
  };
  
  const voltarRegistro = () => {
    router.push("/prae/auxilio/auxilios");
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

  // Efeito exclusivo para o modo de edição
  useEffect(() => {
    pesquisarTipoBolsa();
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