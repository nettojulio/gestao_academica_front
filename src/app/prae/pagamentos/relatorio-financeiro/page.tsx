"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const estrutura: any = {
    uri: "relatorio/financeiro", // Caminho base atualizado

    cabecalho: {
        titulo: "Relatório Financeiro",
        migalha: [
            { nome: 'Home', link: '/home' },
            { nome: 'Financeiro', link: '/financeiro' },
            { nome: 'Relatório Financeiro', link: '/financeiro/relatorio' },
        ]
    },
    tabela: {
        configuracoes: {
            pesquisar: true,
            cabecalho: true,
            rodape: true,
            exportar: true, // Adicionado opção de exportar relatório
        },
        botoes: [
            { nome: 'Gerar Relatório', chave: 'gerar', bloqueado: false },
            { nome: 'Exportar Excel', chave: 'exportar', bloqueado: false },
        ],
        colunas: [
            { nome: "Mês/Ano", chave: "periodo", tipo: "texto", selectOptions: null, sort: true, pesquisar: true },
            { nome: "Receitas", chave: "receitas", tipo: "moeda", selectOptions: null, sort: true, pesquisar: false },
            { nome: "Despesas", chave: "despesas", tipo: "moeda", selectOptions: null, sort: true, pesquisar: false },
            { nome: "Saldo", chave: "saldo", tipo: "moeda", selectOptions: null, sort: true, pesquisar: false },
            { nome: "Status", chave: "status", tipo: "badge", selectOptions: null, sort: true, pesquisar: true },
            { nome: "Ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
        ],
        acoes_dropdown: [
            { nome: 'Detalhes', chave: 'detalhes' },
            { nome: 'Imprimir', chave: 'imprimir' },
            { nome: 'Exportar PDF', chave: 'exportar_pdf' },
        ]
    }
}

const PageLista = () => {
    const router = useRouter();
    const [dados, setDados] = useState<any>({ content: [] });
    const [filtros, setFiltros] = useState({
        periodoInicio: '',
        periodoFim: '',
        tipo: 'todos'
    });
    interface FinanceiroItem {
        receitas: number;
        despesas: number;
        saldo: number;
        // Adicione outras propriedades que existam no item, se necessário
        [key: string]: any; // Para permitir outras propriedades não especificadas
    }

    const chamarFuncao = (nomeFuncao = "", valor: any = null) => {
        switch (nomeFuncao) {
            case 'pesquisar':
                pesquisarRegistro(valor);
                break;
            case 'gerar':
                gerarRelatorio();
                break;
            case 'exportar':
                exportarExcel();
                break;
            case 'detalhes':
                verDetalhes(valor);
                break;
            case 'imprimir':
                imprimirRelatorio(valor);
                break;
            case 'exportar_pdf':
                exportarPDF(valor);
                break;
            default:
                break;
        }
    }

    // Função para carregar os dados do relatório
    const pesquisarRegistro = async (params = null) => {
        try {
            let body = {
                metodo: 'get',
                uri: '/financeiro/' + estrutura.uri,
                params: params != null ? params : {
                    size: 10,
                    page: 0,
                    periodoInicio: filtros.periodoInicio,
                    periodoFim: filtros.periodoFim,
                    tipo: filtros.tipo
                },
                data: {}
            };

            const response = await generica(body);

            if (response?.data?.errors) {
                toast.error("Erro ao carregar relatório. Tente novamente!", { position: "bottom-left" });
            } else if (response?.data?.error) {
                toast.error(response.data.error.message, { position: "bottom-left" });
            } else {
                if (response?.data) {
                    // Adiciona formatação para os valores monetários
                    const dadosFormatados = response.data.content.map((item: FinanceiroItem) => ({
                        ...item,
                        receitas: formatarMoeda(item.receitas),
                        despesas: formatarMoeda(item.despesas),
                        saldo: formatarMoeda(item.saldo),
                        status: getStatusBadge(item.saldo)
                    }));

                    setDados({ ...response.data, content: dadosFormatados });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar relatório:', error);
            toast.error("Erro ao carregar relatório financeiro", { position: "bottom-left" });
        }
    };

    // Função para formatar valores monetários
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    // Função para determinar o status (badge)
    const getStatusBadge = (saldo: number) => {
        return saldo >= 0 ? { texto: 'Positivo', classe: 'bg-green-100 text-green-800' }
            : { texto: 'Negativo', classe: 'bg-red-100 text-red-800' };
    };

    // Função para gerar um novo relatório
    const gerarRelatorio = async () => {
        try {
            const { value: formValues } = await Swal.fire({
                title: 'Gerar Novo Relatório',
                html:
                    '<label for="periodoInicio" class="block text-left mb-2">Período Início (MM/AAAA)</label>' +
                    '<input id="periodoInicio" class="swal2-input mb-3" placeholder="MM/AAAA">' +
                    '<label for="periodoFim" class="block text-left mb-2">Período Fim (MM/AAAA)</label>' +
                    '<input id="periodoFim" class="swal2-input mb-3" placeholder="MM/AAAA">' +
                    '<label for="tipo" class="block text-left mb-2">Tipo de Relatório</label>' +
                    '<select id="tipo" class="swal2-input mb-3">' +
                    '  <option value="todos">Todos</option>' +
                    '  <option value="receitas">Apenas Receitas</option>' +
                    '  <option value="despesas">Apenas Despesas</option>' +
                    '</select>',
                focusConfirm: false,
                preConfirm: () => {
                    return {
                        periodoInicio: (document.getElementById('periodoInicio') as HTMLInputElement).value,
                        periodoFim: (document.getElementById('periodoFim') as HTMLInputElement).value,
                        tipo: (document.getElementById('tipo') as HTMLSelectElement).value
                    }
                }
            });

            if (formValues) {
                setFiltros(formValues);
                pesquisarRegistro();
                toast.success("Relatório gerado com sucesso!", { position: "bottom-left" });
            }
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            toast.error("Erro ao gerar relatório", { position: "bottom-left" });
        }
    };

    // Função para exportar para Excel
    const exportarExcel = async () => {
        try {
            toast.info("Preparando arquivo Excel...", { position: "bottom-left" });

            const body = {
                metodo: 'post',
                uri: '/financeiro/' + estrutura.uri + '/exportar-excel',
                params: {},
                data: {
                    filtros: filtros
                }
            };

            const response = await generica(body);

            if (response?.data?.url) {
                // Criar link para download
                const link = document.createElement('a');
                link.href = response.data.url;
                link.download = `relatorio_financeiro_${new Date().toLocaleDateString()}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Exportação para Excel concluída!", { position: "bottom-left" });
            }
        } catch (error) {
            console.error('Erro ao exportar para Excel:', error);
            toast.error("Erro ao exportar para Excel", { position: "bottom-left" });
        }
    };

    // Função para ver detalhes de um período
    const verDetalhes = (item: any) => {
        router.push(`/financeiro/relatorio/detalhes/${item.id}?periodo=${item.periodo}`);
    };

    // Função para imprimir relatório
    const imprimirRelatorio = (item: any) => {
        window.open(`/financeiro/relatorio/imprimir/${item.id}`, '_blank');
    };

    // Função para exportar PDF
    const exportarPDF = async (item: any) => {
        try {
            toast.info("Preparando PDF...", { position: "bottom-left" });

            const body = {
                metodo: 'post',
                uri: '/financeiro/' + estrutura.uri + '/exportar-pdf',
                params: {},
                data: {
                    id: item.id,
                    periodo: item.periodo
                }
            };

            const response = await generica(body);

            if (response?.data?.url) {
                // Criar link para download
                const link = document.createElement('a');
                link.href = response.data.url;
                link.download = `relatorio_financeiro_${item.periodo}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                toast.success("Exportação para PDF concluída!", { position: "bottom-left" });
            }
        } catch (error) {
            console.error('Erro ao exportar para PDF:', error);
            toast.error("Erro ao exportar para PDF", { position: "bottom-left" });
        }
    };

    useEffect(() => {
        chamarFuncao('pesquisar', null);
    }, [filtros]);

    return (
        <main className="flex flex-wrap justify-center mx-auto">
            <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
                <Cabecalho dados={estrutura.cabecalho} />

                {/* Filtros adicionais */}
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-4">Filtros do Relatório</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Período Início</label>
                            <input
                                type="text"
                                placeholder="MM/AAAA"
                                value={filtros.periodoInicio}
                                onChange={(e) => setFiltros({ ...filtros, periodoInicio: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Período Fim</label>
                            <input
                                type="text"
                                placeholder="MM/AAAA"
                                value={filtros.periodoFim}
                                onChange={(e) => setFiltros({ ...filtros, periodoFim: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select
                                value={filtros.tipo}
                                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="todos">Todos</option>
                                <option value="receitas">Apenas Receitas</option>
                                <option value="despesas">Apenas Despesas</option>
                            </select>
                        </div>
                    </div>
                </div>

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