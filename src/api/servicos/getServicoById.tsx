import api from "@/api/http-common";

export async function getServicoById(id: string | string[] | undefined) {
    return await api.get(`/services/${id}`);
}