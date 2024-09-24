"use client";

import { useMutation } from "react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import style from "./cadastrar-secretaria.module.scss";
import DadosPessoais from "./DadosPessoais";
import DadosEndereco from "./DadosEndereco";
import DadosAdmissao from "./DadosAdmissao";
import { Barbeiro } from "@/interfaces/barbeiroInterface";
import { APP_ROUTES } from "@/constants/app-routes";
import { postBarber } from "@/api/barbeiro/postBarber";
import { Secretaria } from "@/interfaces/secretariaInterface";
import { postSecretaria } from "@/api/secretaria/postSecretaria";

const CadastrarSecretaria = () => {
  const { push } = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const initialValues: Secretaria = {
    idSecretary: '',
    name: '',
    contact: '',
    password:'',
    start: '',
    end: '',
    email: '',
    cpf: '',
    address: {
      street: '',
      number: 0,
      neighborhood: '',
      city: '',
      state: '',
    },
    salary: 0,
    admissionDate: '',
    workload: 0,
    profilePhoto: undefined,
  };

  const validateSchema = Yup.object().shape({
    name: Yup.string().min(5, "O nome deve ter no mínimo 5 caracteres").required("Obrigatório"),
    email: Yup.string().email("Email inválido").required("Obrigatório"),
    cpf: Yup.string()
      .required("Obrigatório"),
    contato: Yup.string()
      .required("Obrigatório"),

      address: Yup.object().shape({
      street: Yup.string().required("Obrigatório"),
      number: Yup.number().required("Obrigatório"),
      neighborhood: Yup.string().required("Obrigatório"),
      city: Yup.string().required("Obrigatório"),
      state: Yup.string().required("Obrigatório"),
    }),
    salary: Yup.number().required("Obrigatório"),
    start: Yup.string()
      .required("Obrigatório")
      .matches(/^\d{2}:\d{2}$/, "Horário inválido"),
    end: Yup.string()
      .required("Obrigatório")
      .matches(/^\d{2}:\d{2}$/, "Horário inválido"),
    admissionDate: Yup.date().required("Obrigatório"),
    workload: Yup.number().required("Obrigatório"),
  });

  const { mutate } = useMutation(
    async (values: Secretaria) => {
      // Extraia a imagem do values
      const profilePhoto = values.profilePhoto as File;
  
      // Remova a imagem do objeto values
      const updatedValues = { ...values };
      delete updatedValues.profilePhoto;
  
      // Envie os valores e a imagem separadamente
      return postSecretaria(updatedValues, profilePhoto);
    },
    {
      onSuccess: () => {
        push(APP_ROUTES.private.secretaria.name); // Ajuste a rota conforme necessário
      },
      onError: (error) => {
        console.log("Erro ao cadastrar um novo barbeiro", error);
      },
    }
  );
  

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("profilePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className={style.header}>
        <div className={style.header__title}>
          <h1>Barbeiro</h1>
          <div className={style.header__title_line}></div>
        </div>
        <div className={style.header__navegacao}>
          <div className={style.header__navegacao_voltar} onClick={() => push(APP_ROUTES.private.secretaria.name)}>
            <img src="/assets/icons/menor_que.svg" alt="Voltar" />
            <h1>Voltar</h1>
          </div>
          <div className={style.header__navegacao_guia}>
            <span>Home / Secretarias /</span><h1>Cadastrar Secretaria</h1>
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
            {(formik) => (
              <Form className={style.container__ContainerForm_form}>
                
                <div className={style.container__photo}>
                <div className={style.profilePhotoWrapper}>
                  <input
                    type="file"
                    id="profilePhoto"
                    name="profilePhoto"
                    accept="image/jpeg"
                    onChange={(event) => handleImageChange(event, formik.setFieldValue)}
                  />
                  <label htmlFor="profilePhoto" className={style.profilePhotoLabel}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile Preview" className={style.profileImage} />
                    ) : (
                      <img src="/assets/icons/perfil.svg" alt="Upload Icon" />
                    )}
                  </label>
                  <span
                    className={style.editIcon}
                    onClick={() => {
                      const fileInput = document.getElementById('profilePhoto');
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                  >
                    <img src="/assets/icons/editar.svg" alt="Edit Icon" />
                  </span>
                </div>

                {formik.touched.profilePhoto && formik.errors.profilePhoto && (
                  <span className={style.form__error}>{formik.errors.profilePhoto}</span>
                )}
                <h1>Informações do Secretaria</h1>
                </div>

                <DadosPessoais formik={formik} />

                <div className={style.container__photo}>
                  <h1>Endereço</h1>
                </div>

                <DadosEndereco formik={formik} />

                <div className={style.container__photo}>
                  <h1>Informações de admissão</h1>
                </div>

                <DadosAdmissao formik={formik} />

                <div className={style.container__ContainerForm_buttons}>
                  <button
                    className={style.container__ContainerForm_buttons_link}
                    type="button"
                    onClick={() => push(APP_ROUTES.private.barbeiros.name)}
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
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CadastrarSecretaria;
