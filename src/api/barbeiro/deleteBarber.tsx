import api from "@/api/http-common";

export async function deleteBarber(id: string | string[] | undefined) {
    return await api.delete(`/barber/${id}`);
}