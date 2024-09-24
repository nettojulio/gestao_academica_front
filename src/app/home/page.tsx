"use client";

import style from "./home.module.scss";
import Menu from "@/components/Menu";
import Home from "@/components/Home";
import { useState } from "react";
import { getStorageItem } from "@/utils/localStore";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function page() {

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
    <div className={style.container}>
        <div className={style.container__menu}>
            <Menu />
        </div>
        <div className={style.container__main}>
            <Home />
        </div>
    </div>
  )
}

const LayoutSecretaria = () => {
    return (
      <div className={style.container}>
          <div className={style.container__menu}>
              <Menu />
          </div>
          <div className={style.container__main}>
              <Home />
          </div>
      </div>
    )
}

const LayoutBarbeiro = () => {
  return (
    <div className={style.container}>
        <div className={style.container__menu}>
            <Menu />
        </div>
        <div className={style.container__main}>
            <Home />
        </div>
    </div>
  )
}
  