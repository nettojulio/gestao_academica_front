import api from "@/api/http-common";
import { Barbeiro } from "@/interfaces/barbeiroInterface";

export async function postBarberNoPhoto(barberData: Barbeiro){
    return await api.post("/barber/create-without-photo", barberData);
}