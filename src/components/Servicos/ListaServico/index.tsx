import { useEffect, useState } from "react";
import style from "./servicos.module.scss";
import { useMutation } from "react-query";
import Table from "./Table";
import { getAllServicos } from "@/api/servicos/getAllServicos"; 
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";
import DetalharServico from "../DetalharServico";
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import { Servico } from "@/interfaces/servicoInterface";



const ServicoComponent = () => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [selectedServico, setSelectedServico] = useState<Servico | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { push } = useRouter();

  const { mutate } = useMutation(() => getAllServicos(currentPage, 3), {
    onSuccess: (res) => {
      setServicos(res.data.content);
      setTotalPages(res.data.totalPages);
    },
    onError: (error: unknown) => {
      console.error('Erro ao recuperar os serviços:', error);
    },
  });

  useEffect(() => {
    mutate();
  }, [currentPage]);

  const filteredServicos = servicos.filter((servico) =>
    servico.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectServico = (servico: Servico) => {
    setSelectedServico(servico);
  };

  const handleBackToList = () => {
    setSelectedServico(null);
  };

  if (selectedServico) {
    return (
      <DetalharServico
        diretorioAtual="dirAtual"
        servico={selectedServico}
        backDetalhamento={handleBackToList}
        dirAnt="dirAnt"
        hrefAnterior={APP_ROUTES.private.home.name}
        hrefAtual={APP_ROUTES.private.servicos.name} 
      />
    );
  }

  return (
    <div>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo="Serviços"
          hrefAnterior={APP_ROUTES.private.home.name}
          diretorioAnterior="Home /"
          diretorioAtual="Serviços"
        />
        <div className={style.header__container}>
          <div className={style.header__container_botoes}>
            <button onClick={() => push(APP_ROUTES.private.cadastrar_servico.name)}>
              <h1>Adicionar Serviço</h1>
              <img src="/assets/icons/cadeira.svg" alt="Ícone de Cadeira" />
            </button>
          </div>
        </div>
      </div>

      <Table
        listServicos={filteredServicos}
        setServicos={setServicos}
        onSelectServico={handleSelectServico}
        table1="Nome"
        table2="Valor"
        table3="Descrição"
        table4="Tempo"
        table5="Ações"
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default ServicoComponent;
