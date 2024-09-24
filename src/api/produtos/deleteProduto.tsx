import api from "@/api/http-common";

export async function deleteProduto(id: string | string[] | undefined) {
    return await api.delete(`/product/${id}`);
}