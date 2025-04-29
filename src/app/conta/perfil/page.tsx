"use client";

import withAuthorization from '@/components/AuthProvider/withAuthorization';
import Cabecalho from '@/components/Layout/Interno/Cabecalho';
import Cadastro from '@/components/Cadastro/Estrutura';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { generica } from '@/utils/api';

const PagePerfil = () => {
  const { id } = useParams();
  const isEditMode = id && id !== "criar";
  const [cursos, setCursos] = useState<any[]>([]);
  const [dadosPreenchidos, setDadosPreenchidos] = useState<any[]>([]);
  const [dadosPerfil, setDadosPerfil] = useState<any>({ content:[] });
  

  const getOptions = (lista: any[], selecionado: any) => {
    if (!Array.isArray(lista) || lista.length === 0) return [];
    const options = lista.map((item) => ({
      chave: item.id, // ID do item (numérico, por exemplo)
      valor: item.nome, // Texto exibido no <option>
    }));
    if (isEditMode && selecionado) {
      const selectedId = Number(selecionado); // Converte para número, se necessário
      const selectedOption = options.find((opt) => opt.chave === selectedId);
      if (selectedOption) {
        // Coloca a opção selecionada na frente do array
        return [selectedOption, ...options.filter((opt) => opt.chave !== selectedId)];
      }
    }
    return options;
  };

  const currentUser = async (params = null) => {
      try {
        let body = {
          metodo: 'get',
          uri: '/auth/usuario/current',
          //+ '/page',
          //params: params != null ? params : { size: 25, page: 0 },
          data: {}
        }
        console.log("requisição", body.uri);
        const response = await generica(body);
        console.log("Response current User",response)
        //tratamento dos erros
        if (response && response.data.errors != undefined) {
          toast("Erro. Tente novamente!", { position: "top-left" });
        } else if (response && response.data.error != undefined) {
          toast(response.data.error.message, { position: "top-left" });
        } else {
          if (response && response.data) {
            setDadosPreenchidos(response.data);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar registros:', error);
      }
    };


  const estrutura: any = {

    uri: "perfil", //caminho base
  
    cabecalho: { //cabecalho da pagina
      titulo: "perfil",
      migalha: [
        { nome: 'Home', link: '/home' },
        { nome: 'Cursos', link: '/cursos' },
        

      ]
    },

    cadastro: {
      campos: [
        {
          line: 1,
          colSpan: "md:col-span-1",
          nome: "Foto Perfil",
          chave: "perfil.fotoPerfil",
          tipo: "foto", // ou outro tipo apropriado
          mensagem: "Anexe os documentos",
          obrigatorio: false,
          bloqueado: isEditMode,

        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome do Solicitante",
          chave: "nome",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          
        },
        {
          line: 2,
          colSpan: "md:col-span-1",
          nome: "Nome Social",
          chave: "nomeSocial",
          tipo: "text",
          mensagem: "Digite o nome social",
          obrigatorio: false,
          bloqueado: true,

        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "Email",
          chave: "email",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,

        },
        {
          line: 3,
          colSpan: "md:col-span-1",
          nome: "CPF",
          chave: "cpf",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          mascara: "cpf",
         
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Telefone",
          chave: "telefone",
          tipo: "text",
          mensagem: "Digite",
          obrigatorio: true,
          bloqueado: true,
          mascara: "celular",

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Matrícula",
          chave: isEditMode ? "perfil.matricula" : "matricula",
          tipo: "text",
          mensagem: "Digite a matrícula",
          obrigatorio: false,
          exibirPara: ["ALUNO"],
          bloqueado: isEditMode,

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Curso",
          chave: isEditMode ? "perfil.curso.nome" : "cursoId",
          tipo: isEditMode ? "select" : "text",
          mensagem: "Selecione o curso",
          obrigatorio: true,
          selectOptions: isEditMode ? null : getOptions(cursos, dadosPreenchidos[0]?.cursoId),
          exibirPara: ["ALUNO"],
          bloqueado: isEditMode,

          // selectOptions: [{ chave: "1", valor: "Engenharia" }, ...]
        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "Cursos",
          chave: isEditMode ? "perfil.cursos" : "cursoIds",
          tipo: "multi-select",
          mensagem: "Selecione cursos",
          obrigatorio: false,
          exibirPara: ["PROFESSOR"],
          selectOptions: isEditMode ? null : getOptions(cursos, Array.isArray(dadosPreenchidos) && dadosPreenchidos[0]?.cursoIds),
          multiple: true, // Permite selecionar múltiplos cursos
          bloqueado: isEditMode,

        },
        {
          line: 4,
          colSpan: "md:col-span-1",
          nome: "SIAPE",
          chave: isEditMode ? "perfil.siape" : "siape",
          tipo: "text",
          mensagem: "Digite o SIAPE",
          obrigatorio: true,
          exibirPara: ["ADMINISTRADOR", "GESTOR", "TECNICO", "PROFESSOR"],
          bloqueado: isEditMode,

        },
      ]

      },  
    };

      useEffect(() => {
        currentUser();
      }, []);

    return (
      <main className="flex flex-wrap justify-center mx-auto">
        <div className="w-full sm:w-11/12 2xl:w-10/12 p-4 sm:p-6 md:p-8 lg:p-12 :p-16 2xl:p-20 pt-7 md:pt-8 md:pb-8 ">
          <Cabecalho dados={estrutura.cabecalho}/>
          <Cadastro 
              estrutura={estrutura}
              dadosPreenchidos={dadosPreenchidos}
              setDadosPreenchidos={setDadosPreenchidos}
          />
        </div>
      </main>
    );
} 

export default withAuthorization(PagePerfil);