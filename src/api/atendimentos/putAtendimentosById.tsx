import api from "@/api/http-common";

export async function putAtendimentoById(id: string | string[] | undefined, newData : any) {
    return await api.put(`/appointments/${id}`, newData);
}