import api from "@/api/http-common";

export async function getgetProdutoByIdPromocaoById(id: string | string[] | undefined) {
    return await api.get(`/product/${id}`);
}