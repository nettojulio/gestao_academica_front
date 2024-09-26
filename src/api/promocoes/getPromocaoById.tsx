import api from "@/api/http-common";

export async function getPromocaoById(id: string | string[] | undefined) {
    return await api.get(`/sale/${id}`);
}