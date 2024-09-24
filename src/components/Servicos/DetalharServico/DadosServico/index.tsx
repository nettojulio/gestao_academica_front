"use client";

import style from "./servico.module.scss";

interface DadosServicoProps {
    formik: any;
    editar: boolean;
    hrefAnterior: string;
}

const DadosServico: React.FC<DadosServicoProps> = ({ formik, editar, hrefAnterior }) => {
  return (
    <>
      <div className={style.container__ContainerForm_form_halfContainer}>
        {editar === false ? (
          <>
            <div>
              <label htmlFor="name">Nome do Serviço</label>
              <input
                id="name"
                className={style.container__ContainerForm_form_input}
                name="name"
                placeholder="Não informado"
                onBlur={formik.handleBlur}
                value={formik.values.name}
                disabled
              />
            </div>
            <div>
              <label htmlFor="description">Descrição</label>
              <input
                id="description"
                className={style.container__ContainerForm_form_input}
                name="description"
                placeholder="Não informado"
                onBlur={formik.handleBlur}
                value={formik.values.description}
                disabled
              />
            </div>
            <div>
              <label htmlFor="value">Valor</label>
              <input
                id="value"
                className={style.container__ContainerForm_form_input}
                name="value"
                placeholder="Não informado"
                onBlur={formik.handleBlur}
                value={formik.values.value}
                disabled
              />
            </div>
            <div>
              <label htmlFor="time">Tempo (minutos)</label>
              <input
                id="time"
                className={style.container__ContainerForm_form_input}
                name="time"
                placeholder="Não informado"
                onBlur={formik.handleBlur}
                value={formik.values.time}
                disabled
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="name">Nome do Serviço</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="name"
                name="name"
                placeholder={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                required
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <span className={style.form__error}>{formik.errors.name}</span>
            ) : null}

            <div>
              <label htmlFor="description">Descrição</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="description"
                name="description"
                placeholder={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                required
              />
              {formik.touched.description && formik.errors.description ? (
                <span className={style.form__error}>{formik.errors.description}</span>
              ) : null}
            </div>

            <div>
              <label htmlFor="value">Valor</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="value"
                name="value"
                placeholder={formik.values.value}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.value}
                required
              />
              {formik.touched.value && formik.errors.value ? (
                <span className={style.form__error}>{formik.errors.value}</span>
              ) : null}
            </div>
            <div>
              <label htmlFor="time">Tempo (minutos)</label>
              <input
                className={style.container__ContainerForm_form_input}
                id="time"
                name="time"
                placeholder={formik.values.time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.time}
                required
              />
              {formik.touched.time && formik.errors.time ? (
                <span className={style.form__error}>{formik.errors.time}</span>
              ) : null}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DadosServico;
