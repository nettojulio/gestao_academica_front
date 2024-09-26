"use client"

import { useMutation } from "react-query";
import { Form, Formik } from "formik";
import style from "./cadastrar-servico.module.scss";
import DadosServico from "./dadosServicos/index";
import * as Yup from 'yup';
import { postServico } from "@/api/servicos/postServico";
import { APP_ROUTES } from "@/constants/app-routes";
import { useRouter } from "next/navigation";
import { Servico } from "@/interfaces/servicoInterface";



const CadastroServico = () => {
  const { push } = useRouter();

  const initialValues: Servico = {
    id: "",
    name: "",
    description: "",
    value: 0,    
    time: 0,     
  };

  const validateSchema = Yup.object().shape({
    name: Yup.string()
      .min(5, "O nome deve ter no mínimo 5 caracteres")
      .required('Obrigatório'),
    description: Yup.string()
      .min(10, "A descrição deve ter no mínimo 10 caracteres")
      .required('Obrigatório'),
    value: Yup.string() 
      .required('Obrigatório'),
    time: Yup.string() 
      .required('Obrigatório'),
  });

  const { status, mutate } = useMutation(
    async (values: Servico) => {
      return postServico(values);
    }, {
    onSuccess: () => {
      push(APP_ROUTES.private.servicos.name); 
    },
    onError: (error) => {
      console.log("Erro ao cadastrar um novo serviço", error);
    }
  });

  return (
    <>
      <div className={style.header}>
        <div className={style.header__title}>
          <h1>Serviços</h1>
          <div className={style.header__title_line}></div>
        </div>
        <div className={style.header__navegacao}>
          <div className={style.header__navegacao_voltar} onClick={() => push(APP_ROUTES.private.servicos.name)}>
            <img src="/assets/icons/menor_que.svg" alt="Voltar" />
            <h1>Voltar</h1>
          </div>
          <div className={style.header__navegacao_guia}>
            <span>Serviços /</span><h1>Cadastrar Serviço</h1>
          </div>
        </div>
      </div>
      <div id="header" className={style.container}>
        <div className={style.container__ContainerForm}>
          <Formik
            initialValues={initialValues}
            validationSchema={validateSchema}
            onSubmit={(values, { setSubmitting }) => {
              mutate(values);
              setSubmitting(false);
            }}
          >
            {(formik) => {
              return (
                <Form className={style.container__ContainerForm_form}>
                  <DadosServico formik={formik} />
                  <div className={style.container__ContainerForm_buttons}>
                    <button
                      className={style.container__ContainerForm_buttons_link}
                      type="button"
                      onClick={() => push(APP_ROUTES.private.servicos.name)}
                    >
                      <h1>Voltar</h1>
                    </button>
                    <button
                      type="submit"
                      className={style.container__ContainerForm_buttons_linkWhite}
                    >
                      <h1>Finalizar</h1>
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CadastroServico;
