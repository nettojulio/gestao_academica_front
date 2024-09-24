"use client";
import style from "./admissao.module.scss";

interface DadosSecretariaProps {
  formik: any;
}

const DadosAdmissao: React.FC<DadosSecretariaProps> = ({ formik }) => {


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
    </>
  );
};

export default DadosAdmissao;
