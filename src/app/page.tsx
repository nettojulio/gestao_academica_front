"use client";

import Card from "@/components/CardDefault";
import style from "./page.module.scss";
import { useState, useEffect } from "react";
import { getStorageItem } from "@/utils/localStore";
import { useRouter } from "next/navigation"; // Importação necessária se usar router em InicioPage
import Login from "@/components/Login";

export default function InicioPage() {
  const [role, setRole] = useState(null); // Inicializa como null
  const router = useRouter(); // Se precisar usar router


  return (
      
      <div className={style.container}>
        <div className={style.container__content}>
          <h1 className={style.container__content_title}>Sistema de Gestão</h1>
          <p className={style.container__content_paragraph}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi commodi culpa labore possimus consequuntur voluptatem dolor optio omnis velit. Eum nesciunt necessitatibus quam voluptas. Ab consectetur dignissimos pariatur architecto sit.</p>
        </div>
        <Login />

      </div>
  );
}

