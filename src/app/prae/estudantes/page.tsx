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

  uri: "estudantes", //caminho base

  cabecalho: { //cabecalho da pagina
    titulo: "Estudantes",
    migalha: [
      { nome: 'Home', link: '/home' },
      { nome: 'Prae', link: '/prae' },
      { nome: 'Estudantes', link: '/prae/estudantes' },
    ]
  },

  tabela: {
    configuracoes: {
      pesquisar: true,//campo pesquisar nas colunas (booleano)
      cabecalho: true,//cabecalho da tabela (booleano)
      rodape: true,//rodape da tabela (booleano)
    },
    botoes: [],
    colunas: [ //colunas da tabela
      { nome: "Nome", chave: "aluno.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
      { nome: "CPF", chave: "aluno.cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
      { nome: "E-mail", chave: "aluno.email", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Curso", chave: "aluno.curso.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Auxílio", chave: "beneficios", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Contato", chave: "aluno.telefone", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, //nome(string),chave(string),tipo(text,select),selectOpcoes([{chave:string, valor:string}]),pesquisar(booleano)
      { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
    ],
    acoes_dropdown: [ //botão de acoes de cada registro
      { nome: 'Visualizar', chave: 'editar' }
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
      case 'editar':
        editarRegistro(valor);
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
        uri: '/prae/' + estrutura.uri,
        //+ '/page',
        params: params != null ? params : { size: 10, page: 0 },
        data: {}
      }
      const response = await generica(body);
      console.log(response?.data)
      //tratamento dos erros
      if (response && response.data.errors != undefined) {
        toast("Erro. Tente novamente!", { position: "bottom-left" });
      } else if (response && response.data.error != undefined) {
        toast(response.data.error.message, { position: "bottom-left" });
      } else {
        if (response && response.data) {
          setDados(response.data);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
    }
  };

  // Função que redireciona para a tela editar
  const editarRegistro = (item: any) => {
    router.push('/prae/estudantes/' + item.id);
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