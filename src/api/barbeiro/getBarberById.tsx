import api from "@/api/http-common";

export async function getBarberById(id: number){
    return await api.get(`/barber/${id}`);
}