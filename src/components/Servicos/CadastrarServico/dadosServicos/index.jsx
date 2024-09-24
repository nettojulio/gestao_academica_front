import style from "../cadastrar-servico.module.scss";

export default function DadosServico({ formik }) {
  return (
    <>
      <div className={style.container__ContainerForm_title}>
        <h1>Informações do Serviço</h1>
      </div>
      <div className={style.container__ContainerForm_form_halfContainer}>
        <div>
          <label>Nome do Serviço<span>*</span></label>
          <input
            className={style.container__ContainerForm_form_halfContainer_input}
            id="name"
            name="name"
            placeholder="Insira o nome do serviço"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            required
          />
          {formik.touched.name && formik.errors.name ? (
            <span className={style.form__error}>{formik.errors.name}</span>
          ) : null}
        </div>
        
        <div>
          <label>Descrição do Serviço<span>*</span></label>
          <input
            className={style.container__ContainerForm_form_halfContainer_input}
            id="description"
            name="description"
            placeholder="Insira a descrição do serviço"
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
          <label>Valor do Serviço <span>*</span></label>
          <input
            className={style.container__ContainerForm_form_halfContainer_input}
            id="value"  
            name="value" 
            type="number"
            placeholder="Insira o valor do serviço"
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
          <label>Tempo do Serviço (minutos) <span>*</span></label>
          <input
            className={style.container__ContainerForm_form_halfContainer_input}
            id="time"  
            name="time" 
            type="number"
            placeholder="Insira o tempo do serviço em minutos"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.time} 
            required
          />
          {formik.touched.time && formik.errors.time ? (
            <span className={style.form__error}>{formik.errors.time}</span>
          ) : null}
        </div>
      </div>
    </>
  );
}
