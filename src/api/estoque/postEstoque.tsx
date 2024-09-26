import api from "@/api/http-common";
import { Estoque } from "@/interfaces/estoqueInterface";

export async function postEstoque(estoqueData: Estoque) {
    return await api.post("/stock", estoqueData);
}