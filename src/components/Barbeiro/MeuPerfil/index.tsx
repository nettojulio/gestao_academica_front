"use client";

import { Form, Formik } from "formik";
import { useEffect, useState } from "react";

import style from "./detalhar-barbeiro.module.scss";
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { Barbeiro, Service } from '@/interfaces/barbeiroInterface';
import DadosAdmissao from "./DadosAdmissao";
import DadosEndereco from "./DadosEndereco";
import DadosPessoais from "./DadosPessoais";
import { APP_ROUTES } from "@/constants/app-routes";
import { putBarberbeiroById } from "@/api/barbeiro/putBarbeiroById";
import { getBarberPhotoById } from "@/api/barbeiro/getBarberPhotoById";
import { getAllServicos } from "@/api/servicos/getAllServicos";

interface DetalharBarbeiroProps {
  hrefAnterior: string;
  barbeiro: Barbeiro | any;
}

const MeuPerfil: React.FC<DetalharBarbeiroProps> = ({ hrefAnterior, barbeiro }) => {
  const { push } = useRouter();
  const [editar, setEditar] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Service[]>([]);
  const [servicosSelecionadosId, setServicosSelecionadosId] = useState<number[]>([]);

  useEffect(() => {
    //fetchServicos();
  }, []);



  const [formData, setFormData] = useState<Barbeiro>({
    idBarber: '',
    name: '',
    email: '',
    contato: '',
    password: '',
    services: [],
    cpf: '',
    address: {
      street: '',
      number: 0,
      neighborhood: '',
      city: '',
      state: '',
    },
    salary: 0,
    start: '',
    end: '',
    admissionDate: '',
    workload: 0,
    idServices: [],
    profilePhoto: undefined,
  });

  useEffect(() => {
    if (barbeiro) {
      setFormData({
        idBarber: barbeiro.idBarber || '',
        name: barbeiro.name || '',
        email: barbeiro.email || '',
        services: barbeiro.services || {},
        password: barbeiro.password || '',
        contato: barbeiro.contato || '',
        cpf: barbeiro.cpf || '',
        start: barbeiro.start || '',
        end: barbeiro.end || '',
        address: barbeiro.address || {},
        salary: barbeiro.salary || 0,
        admissionDate: barbeiro.admissionDate || '',
        workload: barbeiro.workload || 0,
        idServices: barbeiro.idServices || [],
        profilePhoto: undefined,
      });

      if (barbeiro.idBarber) {
        getBarberPhoto(barbeiro.idBarber);
      }
      if (barbeiro.services) {
        const selectedServicesIds = barbeiro.services.map((service: Service) => service.id);
        setServicosSelecionadosId(selectedServicesIds);
      }
    }
  }, [barbeiro]);


  const { mutate: fetchServicos } = useMutation(() => getAllServicos(0, 100), {
    onSuccess: (res) => {
      setServicosDisponiveis(res.data.content);
    },
    onError: (error: unknown) => {
      console.error("Erro ao recuperar os serviços:", error);
    },
  });

  const handleServiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) => parseInt(option.value, 10));

    const updatedSelections = [...servicosSelecionadosId];

    selectedIds.forEach((id) => {
      const index = updatedSelections.indexOf(id);
      if (index > -1) {
        // Remove o serviço se já estiver selecionado
        updatedSelections.splice(index, 1);
      } else {
        // Adiciona o serviço se não estiver selecionado
        updatedSelections.push(id);
      }
    });

    setServicosSelecionadosId(updatedSelections);
    barbeiro.setFieldValue("idServices", updatedSelections);
  };

  const getBarberPhoto = async (idBarber: string) => {
    try {
      const response = await getBarberPhotoById(idBarber);

      if (response.data) {
        const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);


        setImagePreview(imageUrl);  // Atualiza o estado com a URL do Blob
      } else {
        console.error("Nenhum dado encontrado na resposta.");
      }
    } catch (error) {
      console.error("Erro ao buscar a imagem do barbeiro:", error);
    }
  };




  const updateBarber = useMutation(
    async (values: Barbeiro) => {
      // Extraia a imagem do values
      const profilePhoto = values.profilePhoto as File;

      // Remova a imagem e os services do objeto values
      const { profilePhoto: _, ...updatedValues } = values;


      return putBarberbeiroById(barbeiro.idBarber, updatedValues, profilePhoto);
    }, {
    onSuccess: () => {
      push(APP_ROUTES.private.barbeiros.name);
    },
    onError: (error) => {
      console.log("Erro ao atualizar o barbeiro", error);
    }
  });



  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    if (!editar) return;

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
    <div id="header" className={style.container}>
      <HeaderDetalhamento
        titulo="Meu Perfil"
        hrefAnterior={APP_ROUTES.private.home.name}
        diretorioAnterior="Home / "
        diretorioAtual="Meu Perfil"
      />
      <div className={style.container__ContainerForm}>
        <Formik
          initialValues={formData}
          enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
            updateBarber.mutate(values);
            setSubmitting(false);
          }}
        >
          {(formik) => (
            <Form className={style.container__ContainerForm_form}>
              <div className={style.container__header}>
                <div className={style.container__header_title}>
                  <div className={style.container__photo}>
                    <div className={style.profilePhotoWrapper}>
                      <input
                        type="file"
                        id="profilePhoto"
                        name="profilePhoto"
                        accept="image/jpeg"
                        onChange={(event) => handleImageChange(event, formik.setFieldValue)}
                        disabled={!editar}
                      />
                      <label htmlFor="profilePhoto" className={style.profilePhotoLabel}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Profile Preview" className={style.profileImage} />
                        ) : (
                          <img src="/assets/icons/perfil.svg" alt="Upload Icon" />
                        )}
                      </label>
                      {editar && (
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
                      )}
                    </div>

                    {formik.touched.profilePhoto && formik.errors.profilePhoto && (
                      <span className={style.form__error}>{formik.errors.profilePhoto}</span>
                    )}
                  </div>
                  <div>
                    <h1>{formik.values.name}</h1>
                    <p className={style.container__header_title}>
                      {servicosSelecionadosId.map(id => servicosDisponiveis.find(service => service.id === id)?.name).join(", ")}
                    </p>
                  </div>
                </div>
                {!editar ? (
                  <button
                    type="button"
                    onClick={() => setEditar(true)}
                    className={style.container__header_button}
                  >
                    <span>Editar</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    onClick={() => setEditar(false)}
                    className={style.container__header_button}
                  >
                    <span>Salvar</span>
                  </button>
                )}
              </div>

              <DadosPessoais formik={formik} editar={editar} hrefAnterior={hrefAnterior} />
              <div className={style.container__header_title}>
                <h1>Endereço</h1>
              </div>

              <DadosEndereco formik={formik} editar={editar} hrefAnterior={hrefAnterior} />
              <div className={style.container__header_title}>
                <h1>Informações de admissão</h1>
              </div>

              <DadosAdmissao formik={formik} editar={editar} hrefAnterior={hrefAnterior} servicosSelecionadosId={servicosSelecionadosId}
                servicosDisponiveis={servicosDisponiveis}
                handleServiceChange={handleServiceChange}
              />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default MeuPerfil;
