import api from "@/api/http-common";

export async function deletePromocao(id: string | string[] | undefined) {
    return await api.delete(`/sale/${id}`);
}