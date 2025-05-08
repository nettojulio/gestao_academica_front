"use client"

import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { any } from 'zod';

const estrutura: any = {
    uri: "tipo-bolsa",

    cabecalho: {
        titulo: "Tipos de Bolsas",
        migalha: [
            { nome: 'Inicio', link: '/home' },
            { nome: 'Prae', link: '/prae' },
            { nome: 'Tipos de Bolsas', link: '/prae/tipos-de-bolsa' },
        ]
    },

    tabela: {
        configuracoes: {
            pesquisar: true,
            cabecalho: true,
            rodape: true,
        },
        botoes: [
            { nome: 'Adicionar', chave: 'adicionar', bloqueado: false },
        ],
        colunas: [
            { nome: "Nome", chave: "descricao", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
            { nome: "Ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
        ],
        acoes_dropdown: [
            { nome: 'Editar', chave: 'editar' },
            { nome: 'Deletar', chave: 'deletar' },
        ]
    }
}

const PageLista = () => {
    const router = useRouter();
    const [dados, setDados] = useState<any>({ content: [] });

    const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
        switch (nomeFuncao) {
            case 'pesquisar':
                pesquisarRegistro(valor);
                break;
            case 'adicionar':
                adicionarRegistro();
                break;
            case 'editar':
                editarRegistro(valor);
                break;
            case 'deletar':
                deletarRegistro(valor);
                break;
            default:
                break;
        }
    }

    const pesquisarRegistro = async (params = null) => {
        try {
            let body = {
                metodo: 'get',
                uri: '/prae/' + estrutura.uri,
                params: params != null ? params : { size: 25, page: 0 },
                data: {}
            }
            const response = await generica(body);
            if (response && response.data.errors != undefined) {
                toast.error("Erro. Tente novamente!", { position: "top-left" });
            } else if (response && response.data && response.data.error != undefined) {
                if (response && response.data && response.data.error) {
                    toast(response.data.error.message, { position: "top-left" });
                }
            } else {
                if (response && response.data) {
                    setDados(response.data);
                }
            }
        } catch (error) {
            console.error("Erro ao carregar os registros:", error);
        }
    };

    const adicionarRegistro = () => {
        router.push('/prae/tipos-de-bolsa/criar');
    };
    const editarRegistro = (item: any) => {
        router.push('/prae/tipos-de-bolsa/' + item.id);
    };
    const deletarRegistro = async (item: any) => {
        const confirmacao = await Swal.fire({
            title: `Você deseja deletar o tipo de unidade administrativa ${item.nome}?`,
            text: "Essa ação não poderá ser desfeita",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1A759F",
            cancelButtonColor: "#9F2A1A",

            confirmButtonText: "Sim, quero deletar!",
            cancelButtonText: "Cancelar",

            // Classes personalizadas
            customClass: {
                popup: "my-swal-popup",
                title: "my-swal-title",
                htmlContainer: "my-swal-html",
            },
        });

        if (confirmacao.isConfirmed) {
            try {
                const body = {
                    metodo: 'delete',
                    uri: '/prae/' + estrutura.uri + '/' + item.id,
                    params: {},

                };

                const response = await generica(body);
                if (response && response.data && response.data.error) {
                    toast.error("Erro. Tente novamente!", { position: "top-left" });
                } else if (response && response.data && response.data.error) {
                    toast(response.data.error.message, { position: "top-left" });
                } else {
                    pesquisarRegistro();
                    Swal.fire({
                        title: "O tipo de unidade administrativa foi deletada com sucesso!",
                        icon: "success"
                    });
                }
            } catch (error) {
                console.error('Erro ao deletar registro:', error);
                toast.error("Erro ao deletar registro. Tente novamente!", { position: "top-left" });
            }
        }
    };

    useEffect(() => {
        chamarFuncao('pesquisar', null);
    }, []);

    return (
        <main className="flex flex-wrap justify-center mx-auto">
            <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
                <Cabecalho dados={estrutura.cabecalho} />
                <Tabela
                    dados={dados}
                    estrutura={estrutura}
                    chamarFuncao={chamarFuncao}
                />
            </div>
        </main>
    );
};

export default withAuthorization(PageLista);
