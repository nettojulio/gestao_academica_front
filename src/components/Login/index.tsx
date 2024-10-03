"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setStorageItem } from "@/utils/localStore";
import { useMutation } from "react-query";
import style from "./login.module.scss";
import Link from "next/link";
import api from "@/api/http-common";
import { setUserLogin } from "@/redux/userLogin/userLoginSlice";
import { postLogin } from "@/api/auth/postLogin";
import { LoginResponse } from "@/interfaces/loginResponse";


const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { push } = useRouter();

  const dispatch = useDispatch();

  const { status, mutate } = useMutation(
    async () => {
      console.log("Enviando login com email:", email, "e senha:", senha);
      return postLogin({ email, senha });
    },
    {
      onSuccess: (res: LoginResponse) => {
        console.log("Login bem-sucedido:", res);
        api.defaults.headers.authorization = `Bearer ${res.access_token}`;
        setStorageItem("token", res.access_token);
        setStorageItem("refresh_token", res.refresh_token);
        dispatch(setUserLogin(email));
        setStorageItem("userLogin", email);
        push("/home");
        console.log("Access token", res.access_token);
        console.log("Refresh token", res.refresh_token);
      },
      onError: (error) => {
        console.log("Erro ao fazer o login de usuario", error);
      },
    });

  const getEnter = (e: any) => {
    if (e.key === "Enter") {
      mutate();
    }
  }
  
    return (
      <div className={style.login}>
        <div className={style.login__login}>
          <form onSubmit={(e) => 
              { e.preventDefault(); 
                if (!email || !senha) {
                  console.log("Preencha todos os campos");
                  return;
                }
                mutate(); 
              }}>
            <h1 className={style.login__login_title}>Entrar</h1>
            
            <label htmlFor="email" className={style.login__login_label}>
              <p>E-mail</p>
              <input type="email" name="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label htmlFor="senha" className={style.login__login_label}>
              <p>Senha</p>
              <input type="password" name="senha" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </label>

            <Link className={style.login__login_link} href="/recuperarSenha">
              <h2 className={style.login__login_subtitle}>Esqueceu a senha?</h2>
            </Link>

            {status === "error" ? <p className={style.login__login_errorLogin}>E-mail ou senha incorretos</p> : null}

            <button className={`${style.login__login_button} ${status === "loading" || status === "success" ? style.active : ""}`} type="submit">
              Entrar
            </button>

            <h2 className={style.login__login_subtitle1}>
              Não possui conta? &nbsp;
              <Link href="/novoUsuario">
                <span>Crie Agora.</span>
              </Link>
            </h2>
          </form>
        </div>
      </div>
    );
}

export default Login;
