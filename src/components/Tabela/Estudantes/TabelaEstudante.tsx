"use client"
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Tabela from '@/components/Tabela/Estrutura';
import { useRouter } from 'next/navigation';

type Props = {
  botoes: Array<Object>,
  acoes: Array<Object>,
  dados: Array<Object>,
  chamarFuncao: any,
  cabecalho?: Object
};

const makeEstrutura = (botoes: Array<Object>, cabecalho: Object | undefined, acoes: Array<Object>) => {
  return {

    uri: "estudantes", //caminho base

    cabecalho: cabecalho,

    tabela: {
      configuracoes: {
        pesquisar: true,//campo pesquisar nas colunas (booleano)
        cabecalho: true,//cabecalho da tabela (booleano)
        rodape: true,//rodape da tabela (booleano)
      },
      botoes: botoes,
      colunas: [ //colunas da tabela
        { nome: "Nome", chave: "aluno.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "CPF", chave: "aluno.cpf", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "E-mail", chave: "aluno.email", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Curso", chave: "aluno.curso.nome", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "Contato", chave: "aluno.telefone", tipo: "texto", selectOptions: null, sort: false, pesquisar: true },
        { nome: "ações", chave: "acoes", tipo: "button", selectOptions: null, sort: false, pesquisar: false },
      ],
      acoes_dropdown: acoes
    }
  }
}
//cabecalho opcional, se não for passado, não será exibido

const TabelaEstudantes = ({botoes, acoes, dados, chamarFuncao, cabecalho}: Props) => {
  const router = useRouter();
  const estrutura = makeEstrutura(botoes, cabecalho, acoes);


  return (
    <>
      {cabecalho && <Cabecalho dados={estrutura.cabecalho} />}
      <Tabela
        dados={dados}
        estrutura={estrutura}
        chamarFuncao={chamarFuncao}
      />
    </>
  );
};

export default TabelaEstudantes;