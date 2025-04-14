"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

interface DaySlot {
  horario: string;       // ex: "07:00", "12:00"
  userScheduled: boolean;// indica se o usuário atual já agendou esse horário
}

interface MonthCronograma {
  data: string;          // formato "dd/MM/yyyy"
  slots: DaySlot[];      // lista de horários e se estão ou não agendados
}

interface CalendarProps {
  userRole: 'comum' | 'profissional' | any;
  cronogramas: MonthCronograma[];
  onAgendar: (data: string, horario: string) => void;
  onCancelar: (data: string, horario: string) => void;
  tipoAtendimento?: string;
}

// Função para formatar data para "dd/MM/yyyy"
const formatDate = (date: Date): string => {
  const day   = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year  = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Função para converter uma data recebida no formato "dd/MM/yyyy" (apenas garante zero-padding)
const convertDateFormat = (dateStr: string): string => {
  const [day, month, year] = dateStr.split('/');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

const Calendar: React.FC<CalendarProps> = ({
  userRole,
  cronogramas,
  onAgendar,
  onCancelar,
  tipoAtendimento
}) => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDaySlots, setSelectedDaySlots] = useState<DaySlot[]>([]);
  const [selectedDayString, setSelectedDayString] = useState<string>('');

  useEffect(() => {
    // Qualquer efeito extra ao mudar o mês pode ser implementado aqui.
  }, [currentDate]);

  // Altera o mês (Anterior / Próximo)
  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  // Retorna todos os dias do mês atual
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days: Date[] = [];
    for (let d = firstDayOfMonth.getDate(); d <= lastDayOfMonth.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  // Busca o cronograma do dia usando o formato "dd/MM/yyyy"
  const findDayCronograma = (date: Date) => {
    const dateStr = formatDate(date);
    return cronogramas.find((c) => c.data === dateStr);
  };

  // Quando clica em um dia com vagas, abre o modal
  const handleDayClick = (date: Date) => {
    const cronogramaDay = findDayCronograma(date);
    if (!cronogramaDay || cronogramaDay.slots.length === 0) return;
    setSelectedDayString(formatDate(date));
    setSelectedDaySlots(cronogramaDay.slots);
    setIsModalOpen(true);
  };

  // Para usuários comuns: Agendar ou Cancelar um horário
  const handleAgendarSlot = (horario: string) => {
    onAgendar(selectedDayString, horario);
    setSelectedDaySlots((prev) =>
      prev.map((slot) =>
        slot.horario === horario ? { ...slot, userScheduled: true } : slot
      )
    );
  };

  const handleCancelarSlot = (horario: string) => {
    onCancelar(selectedDayString, horario);
    setSelectedDaySlots((prev) =>
      prev.map((slot) =>
        slot.horario === horario ? { ...slot, userScheduled: false } : slot
      )
    );
  };

  // Para profissionais: ações adicionais serão realizadas através de navegação
  const handleEditarSlot = (horario: string) => {
    router.push(`/prae/cronogramas/editar/${selectedDayString}?horario=${horario}`);
  };

  // Fecha o modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const daysInMonth = getDaysInMonth();

  return (
    <main className="p-4 md:p-8">
      {/* Cabeçalho com botões de navegação entre meses */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth('prev')}
          className="px-4 py-2 bg-neutrals-100 text-primary-500 rounded-md border"
        >
          Anterior
        </button>
        <h2 className="text-xl font-bold text-neutrals-900 capitalize">
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => changeMonth('next')}
          className="px-4 py-2 bg-neutrals-100 text-primary-500 rounded-md border"
        >
          Próximo
        </button>
      </div>

      {/* Grid de dias do mês */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        {daysInMonth.map((day, index) => {
          const cronogramaDay = findDayCronograma(day);
          let vagasDisponiveis = 0;
          if (cronogramaDay) {
            vagasDisponiveis = cronogramaDay.slots.filter(s => !s.userScheduled).length;
          }
          return (
            <div key={index} className="border p-2 rounded-md flex flex-col items-center">
              <div className="text-xs font-bold text-neutrals-900">
                {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
              </div>
              <div className="text-lg font-semibold text-neutrals-800">
                {day.getDate()}
              </div>
              {cronogramaDay && cronogramaDay.slots.length > 0 ? (
                <button
                  onClick={() => handleDayClick(day)}
                  className="mt-2 px-2 py-1 text-sm text-white bg-green-500 rounded-md"
                >
                  {vagasDisponiveis > 0 
                    ? `${vagasDisponiveis} vaga${vagasDisponiveis > 1 ? 's' : ''}` 
                    : 'Sem vagas'
                  }
                </button>
              ) : (
                <p className="mt-2 text-sm text-gray-500">Sem vagas</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão para profissionais cadastrarem um novo cronograma */}
      {userRole === 'profissional' && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => router.push('/prae/cronogramas/novo')}
            className="px-4 py-2 bg-primary-500 text-white rounded-md"
          >
            Adicionar Cronograma
          </button>
        </div>
      )}

      {/* Modal para exibir os horários do dia selecionado */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Agendamentos do dia"
        ariaHideApp={false}
        className="absolute bg-white rounded-md p-4 max-w-md top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Agendamentos para {selectedDayString}</h2>
        <div className="flex flex-col gap-2">
          {selectedDaySlots.map((slot, idx) => (
            <div key={idx} className="flex justify-between items-center border p-2 rounded">
              <span className="font-semibold">{slot.horario}</span>
              {userRole === 'profissional' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditarSlot(slot.horario)}
                    className="bg-yellow-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleCancelarSlot(slot.horario)}
                    className="bg-red-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Excluir
                  </button>
                </div>
              ) : (
                slot.userScheduled ? (
                  <button
                    onClick={() => handleCancelarSlot(slot.horario)}
                    className="bg-red-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Cancelar
                  </button>
                ) : (
                  <button
                    onClick={() => handleAgendarSlot(slot.horario)}
                    className="bg-green-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Agendar
                  </button>
                )
              )}
            </div>
          ))}
        </div>
        {userRole === 'profissional' && (
          <div className="mt-4">
            <button
              onClick={() => router.push(`/prae/cronogramas/novo?data=${selectedDayString}`)}
              className="px-4 py-2 bg-primary-500 text-white rounded-md"
            >
              Adicionar Slot
            </button>
          </div>
        )}
        <button
          onClick={closeModal}
          className="mt-4 bg-danger-500 px-4 py-2 rounded text-white"
        >
          Fechar
        </button>
      </Modal>
    </main>
  );
};

export default Calendar;
