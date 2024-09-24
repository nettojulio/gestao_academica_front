import api from "@/api/http-common";
import { Estoque } from "@/interfaces/estoqueInterface";

export async function putEstoqueById(id: number | string | string[] | undefined, newData : Estoque) {
    return await api.put(`/stock/${id}`, newData);
}