import api from "@/api/http-common";
import { Produto } from "@/interfaces/produtoInterface";

export async function putProdutoById(id: number | string | string[] | undefined, newData : Produto) {
    return await api.put(`/product/${id}`, newData);
}