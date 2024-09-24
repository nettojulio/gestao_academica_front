import api from "@/api/http-common";

export async function postAtendimento(atendimentoData: any) {
    return await api.post("/appointments", atendimentoData);
}