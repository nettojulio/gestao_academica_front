"use client"
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { generica } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const makeEstrutura = (acoes:Array<Object>) =>{
    return {

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
      { nome: "Nome", chave: "aluno.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "CPF", chave: "aluno.cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true }, 
      { nome: "E-mail", chave: "aluno.email", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Curso", chave: "aluno.curso.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Auxílio", chave: "beneficios", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "Contato", chave: "aluno.telefone", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
      { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
    ],
    acoes_dropdown: [ //botão de acoes de cada registro
      { nome: 'Visualizar', chave: 'editar' }
    ]
  }
}
}

const PageLista = (acoes : Array<Object>, dados:Array<Object>, chamarFuncao: any) => {
  const router = useRouter();
    const estrutura = makeEstrutura(acoes);


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

export default PageLista;