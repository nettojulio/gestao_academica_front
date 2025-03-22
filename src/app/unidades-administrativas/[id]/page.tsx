"use client";
import withAuthorization from "@/components/AuthProvider/withAuthorization";
import Cadastro from "@/components/Cadastro/Estrutura";
import Cabecalho from "@/components/Layout/Interno/Cabecalho";
import { generica } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useEnderecoByCep } from "@/utils/brasilianStates";
import { useEmpresaByCnpj } from "@/utils/consultarCNPJ";

const cadastro = () => {
  const router = useRouter();
  const { id } = useParams();
  // Inicializamos com um objeto contendo 'endereco' para evitar problemas
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any>({ endereco: {} });

  const isEditMode = id && id !== "criar";

  const estrutura: any = {
    uri: "unidadeGestora",
    cabecalho: {
      titulo: isEditMode ? "Editar Unidade Gestora" : "Cadastrar Unidade Gestora",
      migalha: [
        { nome: "Dashboard", link: "/e-Frotas/dashboard" },
        { nome: "Unidade Gestora", link: "/e-Frotas/configuracao/cadastro/unidade-gestora" },
        {
          nome: isEditMode ? "Editar" : "Criar",
          link: `/e-Frotas/cadastro/unidade-gestora/${isEditMode ? id : "criar"}`,
        },
      ],
    },
    cadastro: {
      campos: [
        // Linha 1

        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "CNPJ",
          chave: "cnpj",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          mascara: "cnpj",
        },
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
          colSpan: "md:col-span-2",
          nome: "Tipo Unidade Gestora",
          chave: "tipo",
          tipo: "select",
          mensagem: "Selecione",
          selectOptions: [
            { chave: "prefeitura", valor: "Prefeitura" },
            { chave: "saude", valor: "Secretaria de Saúde" },
            { chave: "educacao", valor: "Secretaria de Educação" },
            { chave: "camara", valor: "Secretaria de Camara" },
            { chave: "transporte", valor: "Secretaria de Transporte" },
          ],
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Codigo TCE",
          chave: "codigo_tce",
          tipo: "number",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Situação",
          chave: "ativo",
          tipo: "select",
          mensagem: "Digite",
          obrigatorio: false,
          selectOptions: [
            { chave: true, valor: "Ativo" },
            { chave: false, valor: "Inativo" },
          ],
        },
        // Linha 2 - Campos de endereço (sem ponto na chave)
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "CEP",
          chave: "cep",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          mascara: "cep",
        },
        {
          line: 2,
          colSpan: "md:col-span-3",
          nome: "Logradouro",
          chave: "logradouro",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 2,
          colSpan: "md:col-span-2",
          nome: "Complemento",
          chave: "complemento",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: false,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Número",
          chave: "numero",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-2",
          nome: "Bairro",
          chave: "bairro",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-2",
          nome: "Município",
          chave: "municipio",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Estado",
          chave: "estado",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        // Linha 5
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Telefone",
          chave: "telefone",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: false,
          mascara: "telefone",
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Celular",
          chave: "celular",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: false,
          mascara: "celular",
        },
        {
          line: 4,
          colSpan: "md:col-span-2",
          nome: "Email",
          chave: "email",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
        },
        {
          line: 4,
          colSpan: "md:col-span-2",
          nome: "Site",
          chave: "site",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: false,
        },
      ],
      acoes: [
        { nome: "Cancelar", chave: "voltar", tipo: "botao" },
        { nome: isEditMode ? "Salvar" : "Cadastrar", chave: "salvar", tipo: "submit" },
      ],
    },
  };

  // --- Consulta por CNPJ ---
  // O hook será acionado sempre que o campo "cnpjPosto" tiver 14 dígitos válidos.
  const { empresa, loading, error } = useEmpresaByCnpj(dadosPreenchidos?.cnpj || "");
  // Atualiza os campos do formulário quando os dados da empresa são retornados
  useEffect(() => {
    if (empresa) {
      setDadosPreenchidos((prev: any) => ({
        ...prev,
        nome: empresa.nome_fantasia || empresa.razao_social,
        cep: empresa.cep || prev?.cep || "",
        logradouro: empresa.logradouro || prev?.endereco?.logradouro || "",
        complemento: empresa.complemento || prev?.endereco?.complemento || "",
        // Se o número vier na consulta, você pode preencher, senão manter o que foi digitado
        numero: empresa.numero || prev?.endereco?.numero || "",
        bairro: empresa.bairro || prev?.endereco?.bairro || "",
        municipio: empresa.municipio || prev?.endereco?.municipio || "",
        estado: empresa.uf || prev?.endereco?.estado || "",
        telefone: empresa.ddd_telefone_1 || prev?.telefone || "",
        // Se houver dados para celular, email ou site, inclua-os; caso contrário, deixe como estão
        celular: prev?.celular || "",
        email: empresa.email || prev?.email || "",
        site: prev?.site || "",
      }));
    }
  }, [empresa]);

  /**
   * Função para transformar os dados do formulário, agrupando os itens de endereço
   * no objeto 'endereco', conforme o formato esperado pela API.
   */
  const transformarDados = (item: any) => {
    const { cep, logradouro, complemento, numero, bairro, municipio, estado, ...rest } = item;
    return {
      ...rest,
      endereco: { cep, logradouro, complemento, numero, bairro, municipio, estado },
    };
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
    router.push("/e-Frotas/configuracao/cadastro/unidade-gestora");
  };

  /**
   * Salva o registro via POST, transformando os dados para que os itens de endereço
   * fiquem agrupados em um objeto 'endereco'.
   */
  const salvarRegistro = async (item: any) => {
    try {
      const dataToSend = transformarDados(item);
      console.log("Enviando dados:", dataToSend);

      const body = {
        metodo: "post",
        uri: "/" + estrutura.uri,
        params: {},
        data: dataToSend,
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
        uri: "/" + estrutura.uri + "/" + item,
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
        // já que o formulário usa dadosPreenchidos.cep, dadosPreenchidos.logradouro, etc.

        const endereco = data.endereco || {};
        const dadosAchatados = {
          ...data,
          cep: endereco.cep || "",
          logradouro: endereco.logradouro || "",
          complemento: endereco.complemento || "",
          numero: endereco.numero || "",
          bairro: endereco.bairro || "",
          municipio: endereco.municipio || "",
          estado: endereco.estado || "",
        };

        setDadosPreenchidos(dadosAchatados);
      }
    } catch (error) {
      console.error("Erro ao localizar registro:", error);
      toast.error("Erro ao localizar registro. Tente novamente!", { position: "top-left" });
    }
  };

  // Se estiver em modo de edição, carrega os dados ao montar
  useEffect(() => {
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
