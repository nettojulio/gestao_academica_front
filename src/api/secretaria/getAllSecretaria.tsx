import api from "@/api/http-common";

export async function getAllSecretaria(page: number, size: number){
    return await api.get(`/secretary?page=${page}&size=${size}`);
}