import api from "@/api/http-common";
import { Promocao } from "@/interfaces/promocaoInterface";

export async function postPromocao(promotionData: Promocao) {
    return await api.post("/sale", promotionData);
}