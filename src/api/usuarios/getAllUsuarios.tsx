import api from "@/api/http-common";


export const getAllUsuarios = (perfil: string | null, page: number, size: number) => {
    //export async function getAllUsuarios(page: number, size: number){
        //return await api.get(`/usuarios?page=${page}&size=${size}`);
    const url = perfil
      ? `/${perfil}`
      : `/usuario`;
    return api.get(url);
  };