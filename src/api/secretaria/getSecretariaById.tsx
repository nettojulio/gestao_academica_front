import api from "@/api/http-common";

export async function getSecretariaById(id: number){
    return await api.get(`/secretary/${id}`);
}