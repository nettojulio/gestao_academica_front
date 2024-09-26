import api from "@/api/http-common";
import { Servico } from "@/interfaces/servicoInterface";

export async function postServico(servicoData: Servico) {
    return await api.post("/services", servicoData);
}