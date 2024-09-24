
import { APP_ROUTES } from "@/constants/app-routes";
import style from "./header_menu.module.scss";
import { useRouter } from "next/navigation";
import { getStorageItem, setStorageItem } from "@/utils/localStore";
import { useMutation } from "react-query";
import { postLogout } from "@/api/auth/postLogout";
import { useDispatch, useSelector } from "react-redux";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";
import { RootState } from "@/redux/store";

interface HeaderMenuProps {
    name?: string;  
    photo: any;
}
const Header_menu : React.FC<HeaderMenuProps> = ({ name, photo  }) => {
    const { push } = useRouter();

    const userLogin: string = useSelector((state: RootState) => state.userLogin);
    const dispatch = useDispatch();

    const { status, mutate } = useMutation(
        async () => {
            return postLogout();
        },{
            onSuccess: (res) => {
                
                setStorageItem("token", "");
                setStorageItem("userLogin", "");
                setStorageItem("userRole", "");
                dispatch(setUserLogin(""));
                

                push(APP_ROUTES.public.login);
            },
            onError: (erro) => {
                console.error(erro);
            }
        }
    );


    return (
        <>
            <header className={style.header_menu}>
                
                <div className={style.header_menu__circle}>
                    <div className={style.header_menu__circle_img}>
                        <img src={photo} alt={name} />
                    </div>
                </div>
                <div className={style.header_menu__content}>
                    <div className={style.header_menu__content__title}>
                        <h1>Bem vindo,</h1>
                        <span>{name}</span>
                    </div>
                    <button className={style.header_menu__content__button}
                    onClick={() => (mutate())}>
                    <span>Sair</span> 
                    <div className={style.header_menu__content__button_icon}></div>
                </button>

                </div>
            </header>
            <div className={style.header_menu_line}/>
                        
            
        </>
    )
}

export default Header_menu;