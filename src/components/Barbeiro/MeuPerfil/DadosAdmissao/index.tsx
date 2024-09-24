"use client";
import { useEffect, useState } from "react";
import style from "./admissao.module.scss";
import { Service } from "@/interfaces/barbeiroInterface";
import { getAllServicos } from "@/api/servicos/getAllServicos";
import { useMutation } from "react-query";

interface DadosBarbeiroProps {
  formik: any;
  editar: boolean;
  servicosSelecionadosId: number[];
  servicosDisponiveis: Service[];
  hrefAnterior: string;
  handleServiceChange: any;
}

const DadosAdmissao: React.FC<DadosBarbeiroProps> = ({ formik, editar, servicosSelecionadosId, servicosDisponiveis, handleServiceChange }) => {

  return (
    <>
      <div className={style.container__ContainerForm_form_threePartsContainer}>
        <div>
          <label htmlFor="salary">Salario</label>
          <input
            id="salary"
            className={style.container__ContainerForm_form_input}
            name="salary"
            placeholder="Não informado"
            onBlur={formik.handleBlur}
            value={formik.values.salary}
            disabled
            onChange={editar ? formik.handleChange : undefined}
          />
        </div>

        <div>
          <label htmlFor="admissionDate">Data de Admissão </label>
          <input
            id="admissionDate"
            className={style.container__ContainerForm_form_input}
            name="admissionDate"
            type="date"
            placeholder="Não informado"
            onBlur={formik.handleBlur}
            value={formik.values.admissionDate}
            disabled
            onChange={editar ? formik.handleChange : undefined}
          />
        </div>

        <div>
          <label htmlFor="workload">Jornada de Trabalho</label>
          <input
            id="workload"
            className={style.container__ContainerForm_form_input}
            name="workload"
            placeholder="Não informado"
            value={formik.values.workload}
            disabled
            onChange={editar ? formik.handleChange : undefined}
          />
        </div>

        <div>
          <label htmlFor="start">Inicio de Expediente </label>
          <input
            id="start"
            className={style.container__ContainerForm_form_input}
            name="start"
            placeholder="Não informado"
            onChange={editar ? formik.handleChange : undefined}
            onBlur={formik.handleBlur}
            value={formik.values.start}
            disabled
          />
        </div>

        <div>
          <label htmlFor="end">Fim de Expediente </label>
          <input
            id="end"
            className={style.container__ContainerForm_form_input}
            name="end"
            placeholder="Não informado"
            onChange={editar ? formik.handleChange : undefined}
            onBlur={formik.handleBlur}
            value={formik.values.end}
            disabled
          />
        </div>
      </div>
      <div>
        {editar ? (
          <div className={style.container__ContainerForm_form_halfContainer}>
            <label htmlFor="services">Serviços</label>
            <select
              id="services"
              name="services"
              multiple
              className={style.container__ContainerForm_form_input}
              value={servicosSelecionadosId.map(String)}
              onChange={handleServiceChange}
            >
              {servicosDisponiveis.map((servico) => (
                <option key={servico.id} value={String(servico.id)}>
                  {servico.name}
                </option>
              ))}
            </select>
            {servicosSelecionadosId.length > 0 && (
              <div className={style.selectedServices}>
                <h4>Serviços Selecionados:</h4>
                <p>{servicosSelecionadosId.map(id => servicosDisponiveis.find(service => service.id === id)?.name).join(", ")}</p>
              </div>
            )}
            {formik.touched.services && formik.errors.services ? (
              <span className={style.form__error}>{formik.errors.services}</span>
            ) : null}
          </div>
        ) : ("")}
        {formik.touched.services && formik.errors.services ? (
          <span className={style.form__error}>{formik.errors.services}</span>
        ) : null}
      </div>
    </>
  );
};

export default DadosAdmissao;
