"use client";

import { Form, Formik, FormikProps } from "formik";
import { useEffect, useState } from "react";
import style from "./detalhar-servico.module.scss"; 
import HeaderDetalhamento from "@/components/Header/HeaderDetalhamento";
import DadosServico from "./DadosServico"; 
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { putServicoById } from "@/api/servicos/putServicoById"; 
import { APP_ROUTES } from "@/constants/app-routes";
import { Servico } from "@/interfaces/servicoInterface";

interface DetalharServicoProps {
    hrefAnterior: string;
    diretorioAtual: string;
    dirAnt: string;
    hrefAtual: string;
    backDetalhamento: () => void;
    servico: Servico;
}



const DetalharServico: React.FC<DetalharServicoProps> = ({
    hrefAnterior,
    diretorioAtual,
    dirAnt,
    hrefAtual,
    backDetalhamento,
    servico
}) => {
    const { push } = useRouter();
    const [editar, setEditar] = useState(false);

    const [formData, setFormData] = useState({
        id: servico.id,
        name:  '',
        description: '', 
        value: 0, 
        time: 0, 
    });

    useEffect(() => {
        if (servico) {
            setFormData({
                id: servico.id,
                name: servico.name || '',
                description: servico.description || '', 
                value: servico.value || 0, 
                time: servico.time || 0, 
            });
        }
    }, [servico]);

    const { status, mutate } = useMutation(
        async (values: Servico) => {
            return putServicoById(servico.id, values); 
        },
        {
            onSuccess: () => {
                push(APP_ROUTES.private.servicos.name); 
            },
            onError: (error) => {
                console.log("Erro ao atualizar o serviço", error);
            }
        }
    );

    return (
        <div id="header" className={style.container}>
            <HeaderDetalhamento
                titulo="Serviços"
                hrefAnterior={backDetalhamento}
                diretorioAnterior="Home / Serviços / "
                diretorioAtual="Informações do serviço"
            />
            <div className={style.container__ContainerForm}>
                <Formik
                    initialValues={formData}
                    enableReinitialize
                    onSubmit={(values, { setSubmitting }) => {
                        mutate(values);
                        setSubmitting(false);
                    }}
                >
                    {(formik: FormikProps<Servico>) => (
                        <Form className={style.container__ContainerForm_form}>
                            <div className={style.container__header}>
                                <div className={style.container__header_title}>
                                    <h1>Informações do serviço</h1>
                                </div>
                                <button
                                    type="button" 
                                    onClick={() => setEditar(!editar)}
                                    className={style.container__header_button}
                                >
                                    <span>{editar ? 'Salvar' : 'Editar'}</span>
                                    {/*<Image src="/assets/iconLapis.svg" alt="editar perfil" width={25} height={25} /> */}
                                </button>
                            </div>
                            <DadosServico formik={formik} editar={editar} hrefAnterior={hrefAnterior} />
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default DetalharServico;
