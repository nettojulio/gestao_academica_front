import api from "@/api/http-common";
import { Promocao } from "@/interfaces/promocaoInterface";

export async function putPromocaoById(id: string | string[] | undefined, newData : Promocao) {
    return await api.put(`/sale/${id}`, newData);
}