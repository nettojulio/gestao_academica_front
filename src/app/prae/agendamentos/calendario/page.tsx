"use client";
import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Calendar from '@/components/Calendar/calendar';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import { useRole } from '@/context/roleContext';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface TipoAtendimento {
  id: number;
  nome: string;
  tempoAtendimento: string;
  horarios: string[];
}

interface DaySlot {
  id: number;
  horario: string;
  userScheduled: boolean;
  agendamentoId?: number | null;
}

interface MonthCronograma {
  data: string;
  slots: DaySlot[];
  tipoAtendimentoId: number;
  tipoAtendimentoNome: string;
}

const transformCronogramas = (data: any[]): MonthCronograma[] => {
  return data.map(item => ({
    data: item.data ? item.data.split('-').reverse().join('/') : '',
    slots: (item.vagas || []).map((vaga: any) => {
      const agendamento = (item.agendamentos || []).find((a: any) => a.vaga.id === vaga.id);
      return {
        id: vaga.id,
        horario: vaga.horaInicio,
        userScheduled: !vaga.disponivel,
        agendamentoId: agendamento ? agendamento.id : null
      };
    }),
    tipoAtendimentoId: item.tipoAtendimento?.id,
    tipoAtendimentoNome: item.tipoAtendimento?.nome
  }));
};

const estrutura = {
  uri: "agendamento",
  cabecalho: {
    titulo: "Calendário de Agendamentos",
    migalha: [
      { nome: 'Home', link: '/home' },
      { nome: 'Prae', link: '/prae' },
      { nome: 'Agendamento', link: '/prae/agendamentos/calendario' },
    ]
  }
};

const PageLista = () => {
  const router = useRouter();
  const { activeRole } = useRole();
  const [cronogramas, setCronogramas] = useState<MonthCronograma[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<number | ''>('');
  const [filtroVagas, setFiltroVagas] = useState<'todas' | 'disponiveis' | 'agendadas'>('todas');
  const [showModal, setShowModal] = useState(true); // <-- NOVO

  const isPrivileged = activeRole;

  useEffect(() => {
    pesquisarRegistro();
  }, []);

  const pesquisarRegistro = async () => {
    try {
      const body = {
        metodo: 'get',
        uri: '/prae/cronograma',
        params: { size: 100, page: 0 },
        data: {}
      };
      const response = await generica(body);
      if (response?.data?.content) {
        const transformado = transformCronogramas(response.data.content);
        setCronogramas(transformado);
      } else {
        toast.error("Erro ao carregar os cronogramas");
      }
    } catch (err) {
      toast.error("Erro inesperado ao buscar dados.");
      console.error(err);
    }
  };

  const tiposAtendimentoUnicos = Array.from(
    new Map(cronogramas.map(c => [c.tipoAtendimentoId, c.tipoAtendimentoNome])).entries()
  );

  const cronogramasFiltrados = tipoFiltro !== ''
    ? cronogramas
      .filter(c => c.tipoAtendimentoId === Number(tipoFiltro))
      .map(c => ({
        ...c,
        slots:
          filtroVagas === 'todas'
            ? c.slots
            : filtroVagas === 'disponiveis'
              ? c.slots.filter(s => !s.userScheduled)
              : c.slots.filter(s => s.userScheduled)
      }))
    : [];

  const handleAgendar = async (data: string, horario: string) => {
    const cronograma = cronogramas.find(c => c.data === data);
    const slot = cronograma?.slots.find(s => s.horario === horario);
    if (!slot) return toast.error("Vaga não encontrada!");

    try {
      const body = {
        metodo: 'post',
        uri: `/prae/agendamento/${slot.id}/agendar`,
        params: {},
        data: {}
      };
      const response = await generica(body);
      if (!response?.data?.errors && !response?.data?.error) {
        toast.success("Agendamento realizado com sucesso!");
        pesquisarRegistro();
      } else {
        toast.error(response?.data?.error?.message || "Erro ao agendar.");
      }
    } catch (err) {
      toast.error("Erro ao agendar.");
    }
  };

  const handleCancelar = async (data: string, horario: string) => {
    const cronograma = cronogramas.find(c => c.data === data);
    const slot = cronograma?.slots.find(s => s.horario === horario);
    if (!slot) return toast.error("Vaga não encontrada!");

    try {
      const body = {
        metodo: 'post',
        uri: `/prae/agendamento/${slot.id}/cancelar`,
        params: {},
        data: {}
      };
      const response = await generica(body);
      if (!response?.data?.errors && !response?.data?.error) {
        toast.success("Agendamento cancelado com sucesso!");
        pesquisarRegistro();
      } else {
        toast.error(response?.data?.error?.message || "Erro ao cancelar.");
      }
    } catch (err) {
      toast.error("Erro ao cancelar.");
    }
  };

  return (
    <main className="flex flex-wrap justify-center mx-auto">
      <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 pt-7">
        <Cabecalho dados={estrutura.cabecalho} />

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-center">Selecione o tipo de atendimento</h2>
              <select
                className="w-full border px-3 py-2 rounded mb-4"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    setTipoFiltro(Number(value));
                    setShowModal(false);
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Escolha uma opção</option>
                {tiposAtendimentoUnicos.map(([id, nome]) => (
                  <option key={id} value={id}>{nome}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* FILTRO EXTRA (opcional) */}
        {/* FILTROS DEPOIS QUE O MODAL SOME */}
        {!showModal && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Tipo de atendimento:</label>
            <select
              value={tipoFiltro}
              onChange={e => setTipoFiltro(e.target.value ? Number(e.target.value) : '')}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-700 transition-colors"
            >
              {tiposAtendimentoUnicos.map(([id, nome]) => (
                <option key={id} value={id}>{nome}</option>
              ))}
            </select>
          </div>
        )}


        {/* CALENDÁRIO */}
        {!showModal && (
          <Calendar
            userRole={isPrivileged}
            cronogramas={cronogramasFiltrados}
            onAgendar={handleAgendar}
            onCancelar={handleCancelar}
          />
        )}
      </div>
    </main>
  );
};

export default withAuthorization(PageLista);
