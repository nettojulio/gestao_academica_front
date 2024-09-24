import api from "@/api/http-common";
import { Produto } from "@/interfaces/produtoInterface";

export async function postProduto(produtoData: Produto) {
    return await api.post("/product", produtoData);
}