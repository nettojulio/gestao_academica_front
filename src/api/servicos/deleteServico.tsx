import api from "@/api/http-common";

export async function deleteServico(id: string | string[] | undefined) {
    return await api.delete(`/services/${id}`);
}