
import { AuthTokenService } from '@/app/authentication/auth.token';
import axios from 'axios';
import https from 'https';
import router from 'next/router';
import { toast } from 'react-toastify';

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}` || "http://localhost:8080/api/v1";
const BASE_URL_API_AUTENTICACAO = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth`
    : "http://localhost:8080/api/v1/auth";





export const genericaApiAuth = async ({ metodo = '', uri = '', params = {}, data = {} }: any) => {
    try {
        const url = `${BASE_URL_API_AUTENTICACAO}${uri}`;

        const response = await axios({
            method: metodo,
            url: url,
            params: params,
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response;
    } catch (error: any) {
        // ✅ Garante que a API realmente retornou um erro e captura a mensagem
        if (error.response) {
            const errorMessage = error.response.data?.message || "Erro desconhecido.";

            // ✅ Retorna a resposta já estruturada para exibição no frontend
            return {
                status: error.response.status,
                data: { message: errorMessage }
            };
        }
        else if (error.request) {
            return {
                status: 500,
                data: { message: "Nenhuma resposta recebida do servidor." }
            };
        }
        else {
            return {
                status: 500,
                data: { message: "Erro ao configurar a requisição." }
            };
        }
    }
};


export const generica = async ({ metodo = '', uri = '', params = {}, data = {} }: any) => {
    try {
        const url = `${BASE_URL}${uri}`;
        const accessToken = AuthTokenService.getAccessToken();

        if (accessToken === null) {
            toast.error("Sessão expirada. Redirecionando...", { position: "top-left" });
            router.push("/conta/sair");
            return null;
        }

        const response = await axios({
            method: metodo,
            url: url,
            params: params,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            }
        });

        return response;

    } catch (error: any) {
        let errorMessage = "Ocorreu um erro ao processar sua requisição.";

        if (error.response) {
            if (error.response.status === 401) {
                errorMessage = "Sessão expirada. Faça login novamente.";
                router.push("/conta/sair");
            } else if (error.response.status === 404) {
                errorMessage = "Recurso não encontrado.";
            } else if (error.response.status === 500) {
                errorMessage = "Erro interno do servidor.";
            } else {
                errorMessage = error.response.data?.message || "Erro desconhecido.";
            }
        } else if (error.code === 'ERR_NETWORK') {
            errorMessage = "Falha na conexão com o servidor.";
            router.push('/conta/sair');
        }

        toast.error(errorMessage, { position: "top-left" });

        return { status: error.response?.status || 500, data: { message: errorMessage } };
    }
};

export function exibirMensagemErroGenerica(response: any, campos: Array<Array<{ chave: any }>>) {
    if (!response) {
        toast.error("Erro desconhecido.", { position: "top-left" });
        return;
    }

    const { status, data } = response;

    if (status === 400 && !data.errors) {
        toast.error("Erro: " + data.detail, { position: "top-left" });
    } else if (status === 403) {
        const message = data && data !== "" ? data : "O usuário não tem autorização para executar a ação";
        toast(`Erro: ${message}`, { position: "top-left" });
    } else if (data.status === 404) {
        toast.error("Erro: " + data.detail, { position: "top-left" });
    } else if (status === 409) {
        toast.error("Erro: " + data.detail, { position: "top-left" });
    } else if (status === 500) {
        toast.error("Erro: " + data, { position: "top-left" });
    } else if (data.errors) {
        campos.forEach(linha => {
            linha.forEach(campo => {
                const error = data.errors[campo.chave];
                if (error) {
                    toast(`Erro: ${error}`, { position: "top-left" });
                }
            });
        });
    } else if (data.error) {
        toast(data.error.message, { position: "top-left" });
    }
};

/**
 * Função genérica para consultar listagens de dados.
 *
 * @param uri - Endpoint da API para buscar os dados.
 * @param setDados - Função para atualizar o estado com os dados retornados.
 * @param params - Parâmetros opcionais da requisição.
 */
export async function genericaListagem(
    uri: string,
    setDados: (dados: any) => void,
    params: Record<string, any> | undefined
) {
    try {
        const finalParams = {
            size: 25,
            page: 0,
        };

        if (params) {
            Object.assign(finalParams, params);
        }

        const response = await generica({
            metodo: "get",
            uri,
            params: finalParams,
        });

        if (response && response.data && response.data.errors) {
            toast.error("Erro. Tente novamente!", { position: "top-left" });
        } else if (response && response.data && response.data.error) {
            toast.error(response.data.error.message, { position: "top-left" });
        } else {
            if (response && response.data) {
                setDados(response.data);
            }
        }
    } catch (error) {
        toast("Ocorreu um erro desconhecido ao buscar os dados.", {
            position: "top-left",
        });
    }
};

export const genericaDashboard = async ({ metodo = '', uri = '', params = {}, data = {} }: any) => {
    try {
        const url = `${BASE_URL}${uri}`;

        const response = await axios({
            //httpsAgent: agent,
            method: metodo,
            url: url,
            params: params,
            data: data,
            headers: {
                "Content-Type": "application/json",
            }
        });

        return response;

    } catch (error) {
        console.error(`Erro ao fazer requisição ${metodo} para ${uri}:`, error);

        throw error;
    }
};