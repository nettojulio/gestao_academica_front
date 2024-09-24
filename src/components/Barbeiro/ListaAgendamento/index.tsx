import { useEffect, useState } from "react";
import style from "./agendamento.module.scss";
import { useMutation } from "react-query";
import Table from "./Table";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import { Agendamento } from "@/interfaces/agendamentoInterface";
import { getAllAtendimentos } from "@/api/atendimentos/getAllAtendimentos";

const ListaAgendamentos = () => {
  const [agendamento, setAgendamentos] = useState<Agendamento[]>([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { push } = useRouter();

  const { mutate } = useMutation(() => getAllAtendimentos(currentPage, 3), {
    onSuccess: (res) => {
      setAgendamentos(res.data.content);
      setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error('Erro ao recuperar as promoções:', error);
    }
  });

  useEffect(() => {
    mutate();
  }, [currentPage]);

  const filteredAgendamentos = agendamento.filter((agendamento) =>
    agendamento?.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAgendamento = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
  };

  const handleBackToList = () => {
    setSelectedAgendamento(null);
  };

  //if (selectedBarbeiro) {
   // return <DetalharBarbeiro
   //   barbeiro={selectedBarbeiro}
  //    backDetalhamento={handleBackToList}
  //    hrefAnterior={APP_ROUTES.private.home.name}
  //  />
  //}

  return (
    <div>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo="Agendamentos"
          hrefAnterior={APP_ROUTES.private.home.name}
          diretorioAnterior="Home /"
          diretorioAtual="Agendamentos"
        />
        <div className={style.header__container}>
         <div className={style.header__container_botoes}>
            <button onClick={() => (push(APP_ROUTES.private.historico.name))}>
              <h1>
                Adicionar Agendamento
              </h1>
              <img src="/assets/icons/navalha.svg" alt="Navalha" />
            </button>
          </div>
        </div>
      </div>

      <Table
        listAgendamentos={filteredAgendamentos}
        setAgendamentos={setAgendamentos}
        onSelectAgendamento={handleSelectAgendamento}
        table1="Nome"
        table2="Contato"
        table3="Ações"
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ListaAgendamentos;