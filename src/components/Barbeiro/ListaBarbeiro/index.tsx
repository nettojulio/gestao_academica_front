import { useEffect, useState } from "react";
import style from "./barbeiro.module.scss";
import { useMutation } from "react-query";
import Table from "./Table";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import { getAllBarbers } from "@/api/barbeiro/getAllBarbers";
import DetalharBarbeiro from "../DetalharBarbeiro";
import { Barbeiro } from '@/interfaces/barbeiroInterface'; 

const ListaBarbeiros = () => {
  const [barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
  const [selectedBarbeiro, setSelectedBarbeiro] = useState<Barbeiro | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { push } = useRouter();

  const { mutate } = useMutation(() => getAllBarbers(currentPage, 3), {
    onSuccess: (res) => {
      setBarbeiros(res.data.content);
      setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error('Erro ao recuperar as promoções:', error);
    }
  });

  useEffect(() => {
    mutate();
  }, [currentPage]);

  const filteredBarbeiros = barbeiros.filter((barbeiro) =>
    barbeiro?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBarbeiro = (barbeiro: Barbeiro) => {
    setSelectedBarbeiro(barbeiro);
  };

  const handleBackToList = () => {
    setSelectedBarbeiro(null);
  };

  if (selectedBarbeiro) {
    return <DetalharBarbeiro
      barbeiro={selectedBarbeiro}
      backDetalhamento={handleBackToList}
      hrefAnterior={APP_ROUTES.private.home.name}
    />
  }

  return (
    <div>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo="Barbeiros"
          hrefAnterior={APP_ROUTES.private.home.name}
          diretorioAnterior="Home /"
          diretorioAtual="Barbeiros"
        />
        <div className={style.header__container}>
         <div className={style.header__container_botoes}>
            <button onClick={() => (push(APP_ROUTES.private.cadastrar_barbeiro.name))}>
              <h1>
                Adicionar Barbeiro
              </h1>
              <img src="/assets/icons/navalha.svg" alt="Navalha" />
            </button>
          </div>
        </div>
      </div>

      <Table
        listBarbeiros={filteredBarbeiros}
        setBarbeiros={setBarbeiros}
        onSelectBarbeiro={handleSelectBarbeiro}
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

export default ListaBarbeiros;