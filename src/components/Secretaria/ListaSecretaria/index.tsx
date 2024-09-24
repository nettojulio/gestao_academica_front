import { useEffect, useState } from "react";
import style from "./secretaria.module.scss";
import { useMutation } from "react-query";
import Table from "./Table";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/app-routes";
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import DetalharSecretaria from "../DetalharSecretaria";
import { Secretaria } from "@/interfaces/secretariaInterface";
import { getAllSecretaria } from "@/api/secretaria/getAllSecretaria";

const ListaSecretaria = () => {
  const [secretaria, setSecretaria] = useState<Secretaria[]>([]);
  const [selectedSecretaria, setSelectedSecretaria] = useState<Secretaria | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { push } = useRouter();

  const { mutate } = useMutation(() => getAllSecretaria(currentPage, 3), {
    onSuccess: (res) => {
      setSecretaria(res.data.content);
      setTotalPages(res.data.totalPages);
    },
    onError: (error) => {
      console.error('Erro ao recuperar as promoções:', error);
    }
  });

  useEffect(() => {
    mutate();
  }, [currentPage]);

  const filteredSecretarias = secretaria.filter((secretaria) =>
    secretaria?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectSecretaria = (secretaria: Secretaria) => {
    setSelectedSecretaria(secretaria);
  };

  const handleBackToList = () => {
    setSelectedSecretaria(null);
  };

  if (selectedSecretaria) {
    return <DetalharSecretaria
      secretaria={selectedSecretaria}
      backDetalhamento={handleBackToList}
      hrefAnterior={APP_ROUTES.private.home.name}
    />
  }

  return (
    <div>
      <div className={style.header}>
        <HeaderDetalhamento
          titulo="Secretarias"
          hrefAnterior={APP_ROUTES.private.home.name}
          diretorioAnterior="Home /"
          diretorioAtual="Secretarias"
        />
        <div className={style.header__container}>
         <div className={style.header__container_botoes}>
            <button onClick={() => (push(APP_ROUTES.private.cadastrar_secretaria.name))}>
              <h1>
                Adicionar Secretaria
              </h1>
              <img src="/assets/icons/navalha.svg" alt="Navalha" />
            </button>
          </div>
        </div>
      </div>

      <Table
        listSecretarias={filteredSecretarias}
        setSecretaria={setSecretaria}
        onSelectSecretaria={handleSelectSecretaria}
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

export default ListaSecretaria;