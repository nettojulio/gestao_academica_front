import api from "@/api/http-common";

export async function deleteAtendimento(id: string | string[] | undefined) {
    return await api.delete(`/appointments/${id}`);
}