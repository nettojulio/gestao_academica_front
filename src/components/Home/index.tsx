import { useState } from "react";
import style from "./home.module.scss";
import { getStorageItem } from "@/utils/localStore";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";  // Import the correct type

export default function Home () {
    const [role, setRole] = useState<string | null>(getStorageItem("userRole"));
    
    const userLogin = useSelector((state: RootState) => state.userLogin);
    function whatIsTypeUser() {
        if (role === "ADMIN") {
            return <LayoutAdmin />
        } else if (role === "BARBER") {
            return <LayoutBarbeiro />
        } else if (role === "SECRETARY") {
             return <LayoutSecretaria/>
        }
    } 

    return (
        whatIsTypeUser()  
    )
}

const LayoutAdmin = () => {
    return (
      <>
        <div className={style.main}/>
      </>
    )
}

const LayoutSecretaria = () => {
    return (
      <>
        <div className={style.main}/>
      </>
    )
}

const LayoutBarbeiro = () => {
    return (
      <>
        < div className={style.main} />
      </>
    )
}
