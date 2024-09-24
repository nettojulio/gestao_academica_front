//import BackgroundDropdown from "../BackgroundDropdown";
import style from "./botao_menu.module.scss";
import { useRouter } from "next/navigation";

interface BotaoMenuProps {
    title: string;
    icon: string;
    route: string;
}

const Botao_menu : React.FC<BotaoMenuProps> = ({ title, icon, route }) => {

    const { push } = useRouter();

    return (
        <>
        <button className={style.button_menu} onClick={() => push((route))}>
        <span>{title}</span>
            <div className={style.container__menu_button_menu_icon}>
                <img src={icon} alt={title} />
            </div>
        </button>
            
        </>
    )
}

export default Botao_menu;