import api from "@/api/http-common";

export async function getPromocaoValida() {
    return await api.get("/sale/valid");
}