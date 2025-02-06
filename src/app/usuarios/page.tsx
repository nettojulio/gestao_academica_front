import { APP_ROUTES } from "@/constants/app-routes";
import style from "./page.module.scss";
import Lista from "@/components/Lista";
const Page = () => {

    return (
        <div className={style.containerList}>
            <Lista
                titulo="Usuarios"
                hrefAnterior={APP_ROUTES.private.home.name}
                diretorioAnterior="Home /"
                diretorioAtual="Usuarios"
                firstbutton=""
                routefirstbutton={""}
                lastbutton=""
                routelastbutton={""}
                table1="Nome"
                table2="Nome Social"
                table3="Telefone"
                table4="CPF"
                table5="Ações"
            />

        </div>
    )
}

export default Page;