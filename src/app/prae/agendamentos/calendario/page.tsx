"use client"
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Calendar from '@/components/Calendar/calendar';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { useRole } from '@/context/roleContext';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface TipoAtendimento {
  nome: string;
  tempoAtendimento: string;
  horarios: string[];
}

interface CronogramaOriginal {
  data: string; // formato "dd/MM/yyyy"
  tipoAtendimentoId: number;
  tipoAtendimento: TipoAtendimento;
}

// Interfaces esperadas pelo Calendar
interface DaySlot {
  horario: string;
  userScheduled: boolean;
}

interface MonthCronograma {
  data: string;
  slots: DaySlot[];
  tipoAtendimentoId: number;
  tipoAtendimentoNome: string;
}

const convertDateFormat = (dateStr: string): string => {
  // Garante que a data esteja no formato "dd/MM/yyyy", com zero-padding se necessário
  const [day, month, year] = dateStr.split('/');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};



const transformCronogramas = (data: any[]): MonthCronograma[] => {
  return data.map(item => ({
    data: item.data
      ? item.data.split('-').reverse().join('/') // "2025-05-22" -> "22/05/2025"
      : '',
    slots: (item.vagas || []).map((vaga: any) => ({
      horario: vaga.horaInicio,
      userScheduled: !vaga.disponivel
    })),
    tipoAtendimentoId: item.tipoAtendimento?.id,
    tipoAtendimentoNome: item.tipoAtendimento?.nome
  }));
};


const estrutura: any = {

  uri: "agendamento", //caminho base

  cabecalho: { //cabecalho da pagina
    titulo: "Calendario de Agendamentos",
    migalha: [
      { nome: 'Home', link: '/home' },
      { nome: 'Prae', link: '/prae' },
      { nome: 'Agendamento', link: '/prae/agendamentos/calendario' },
    ]
  },

}

const PageLista = () => {
  const router = useRouter();
  const [dados, setDados] = useState<any>({ content: [] });
  // Obtenha activeRole e userRoles do contexto
  const { activeRole, userRoles } = useRole();
  const [cronogramas, setCronogramas] = useState<MonthCronograma[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<number | null>(null);
  const [filtroVagas, setFiltroVagas] = useState<'todas' | 'disponiveis' | 'agendadas'>('todas');

  const tiposAtendimentoUnicos = Array.from(
    new Map(cronogramas.map(c => [c.tipoAtendimentoId, c.tipoAtendimentoNome])).entries()
  );

  const cronogramasFiltrados = (tipoFiltro
    ? cronogramas.filter(c => c.tipoAtendimentoId === tipoFiltro)
    : cronogramas
  ).map(c => ({
    ...c,
    slots:
      filtroVagas === 'todas'
        ? c.slots
        : filtroVagas === 'disponiveis'
          ? c.slots.filter(s => !s.userScheduled)
          : c.slots.filter(s => s.userScheduled)
  }));

  // Verifique se o usuário é privilegiado com base na role ativa
  const isPrivileged = activeRole;//activeRole === "administrador" || activeRole === "gestor";
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // formata o mês para 2 dígitos
  const year = today.getFullYear();

  useEffect(() => {
    chamarFuncao('pesquisar', null);
  }, []);

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
  // Função para carregar os dados
  const pesquisarRegistro = async (params = null) => {
    try {
      let body = {
        metodo: 'get',
        uri: '/prae/cronograma',
        params: params != null ? params : { size: 25, page: 0 },
        data: {}
      }
      const response = await generica(body);
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setDados(response.data);
          // Aqui transforma e seta os cronogramas para o calendário
          const transformed = transformCronogramas(response.data.content || response.data);
          setCronogramas(transformed);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };
  // Função que redireciona para a tela adicionar
  const adicionarRegistro = () => {
    router.push('/prae/agendamentos/tipo/criar');
  };
  // Função que redireciona para a tela editar
  const editarRegistro = (item: any) => {
    router.push('/prae/agendamentos/tipo/' + item.id);
  };
  // Função que deleta um registro
  const deletarRegistro = async (item: any) => {
    const confirmacao = await Swal.fire({
      title: `Você deseja deletar o tipo de atendimento:  ${item.descricao}?`,
      text: "Essa ação não poderá ser desfeita",
      icon: "warning",
      showCancelButton: true,

      // Ajuste as cores conforme seu tema
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
          data: {}
        };

        const response = await generica(body);

        if (response && response.data && response.data.errors) {
          toast.error("Erro. Tente novamente!", { position: "top-left" });
        } else if (response && response.data && response.data.error) {
          toast.error(response.data.error.message, { position: "top-left" });
        } else {
          pesquisarRegistro();
          Swal.fire({
            title: "Tipo de atendimento deletado com sucesso!",
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

  // Callbacks de agendar/cancelar
  const handleAgendar = (data: string, horario: string) => {
    // Lógica para chamar API e efetivar agendamento
    console.log(`Agendar: dia ${data}, horário ${horario}`);
  };

  const handleCancelar = (data: string, horario: string) => {
    // Lógica para cancelar agendamento
    console.log(`Cancelar: dia ${data}, horário ${horario}`);
  };

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
        <Cabecalho dados={estrutura.cabecalho} />
        <div className="mb-4 flex gap-4">
          <div>
            <label className="mr-2 font-semibold">Tipo de atendimento:</label>
            <select
              value={tipoFiltro ?? ''}
              onChange={e => setTipoFiltro(e.target.value ? Number(e.target.value) : null)}
              className="border rounded px-2 py-1"
            >
              <option value="">Todos</option>
              {tiposAtendimentoUnicos.map(([id, nome]) => (
                <option key={id} value={id}>{nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2 font-semibold">Vagas:</label>
            <select
              value={filtroVagas}
              onChange={e => setFiltroVagas(e.target.value as any)}
              className="border rounded px-2 py-1"
            >
              <option value="todas">Todas</option>
              <option value="disponiveis">Disponíveis</option>
              <option value="agendadas">Agendadas</option>
            </select>
          </div>
        </div>

        <Calendar
          userRole={isPrivileged}
          cronogramas={cronogramasFiltrados}
          onAgendar={handleAgendar}
          onCancelar={handleCancelar}
        />
      </div>
    </main>
  );
};

export default withAuthorization(PageLista);