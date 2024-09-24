import api from "@/api/http-common";
import { Servico } from "@/interfaces/servicoInterface";

export async function putServicoById(id: string | string[] | undefined, newData : Servico) {
    return await api.put(`/services/${id}`, newData);
}