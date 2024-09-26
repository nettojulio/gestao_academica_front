"use client";
import { useEffect, useState } from "react";
import style from "./admissao.module.scss";
import { Service } from "@/interfaces/barbeiroInterface";
import { getAllServicos } from "@/api/servicos/getAllServicos";
import { useMutation } from "react-query";

interface DadosBarbeiroProps {
  formik: any;
}

const DadosAdmissao: React.FC<DadosBarbeiroProps> = ({ formik }) => {
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Service[]>([]);
  const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);

  useEffect(() => {
    fetchServicos();
  }, []);

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

    const updatedSelections = [...servicosSelecionados];

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

    setServicosSelecionados(updatedSelections);
    formik.setFieldValue("idServices", updatedSelections);
  };

  return (
    <>
      <div className={style.container__ContainerForm_form_threePartsContainer}>
        <div>
          <label htmlFor="salary">Salario</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="salary"
            name="salary"
            placeholder={formik.values.salary}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.salary}
            required
          />
        </div>
        {formik.touched.salary && formik.errors.salary ? (
          <span className={style.form__error}>{formik.errors.salary}</span>
        ) : null}

        <div>
          <label htmlFor="admissionDate">Data de admissão</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="admissionDate"
            name="admissionDate"
            type="date"
            placeholder={formik.values.admissionDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.admissionDate}
            required
          />
          {formik.touched.admissionDate && formik.errors.admissionDate ? (
            <span className={style.form__error}>{formik.errors.admissionDate}</span>
          ) : null}
        </div>

        <div>
          <label htmlFor="workload">Jornada de Trabalho</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="workload"
            name="workload"
            placeholder={formik.values.workload}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.workload}
            required
          />
          {formik.touched.workload && formik.errors.workload ? (
            <span className={style.form__error}>{formik.errors.workload}</span>
          ) : null}
        </div>
      </div>
      
      <div className={style.container__ContainerForm_form_halfContainer}>
        <div>
          <label htmlFor="start">Inicio de Expediente</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="start"
            name="start"
            placeholder={formik.values.start}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.start}
            required
          />
          {formik.touched.start && formik.errors.start ? (
            <span className={style.form__error}>{formik.errors.start}</span>
          ) : null}
        </div>
        <div>
          <label htmlFor="end">Fim de Expediente</label>
          <input
            className={style.container__ContainerForm_form_input}
            id="end"
            name="end"
            placeholder={formik.values.end}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.end}
            required
          />
          {formik.touched.end && formik.errors.end ? (
            <span className={style.form__error}>{formik.errors.end}</span>
          ) : null}
        </div>
      </div>
      
      <div>
        <label htmlFor="services">Serviços</label>
        <select
          id="services"
          name="services"
          multiple
          className={style.container__ContainerForm_form_input}
          value={servicosSelecionados.map(String)}
          onChange={handleServiceChange}
        >
          {servicosDisponiveis.map((servico) => (
            <option key={servico.id} value={servico.id}>
              {servico.name}
            </option>
          ))}
        </select>
        {formik.touched.services && formik.errors.services ? (
          <span className={style.form__error}>{formik.errors.services}</span>
        ) : null}
      </div>

      {/* Mostrando itens selecionados */}
      {servicosSelecionados.length > 0 && (
        <div className={style.selectedServices}>
          <h4>Serviços Selecionados:</h4>
          <ul>
            {servicosSelecionados.map((id) => {
              const service = servicosDisponiveis.find((s) => s.id === id);
              return service ? <li key={id}>{service.name}</li> : <li key={id}>Serviço não encontrado</li>;
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default DadosAdmissao;
