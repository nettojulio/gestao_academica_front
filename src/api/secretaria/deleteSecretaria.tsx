import api from "@/api/http-common";

export async function deleteSecretaria(id: string | string[] | undefined) {
    return await api.delete(`/secretary/${id}`);
}