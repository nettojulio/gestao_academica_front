import api from "../http-common";

export async function getAllAtendimentosBarbeiro(barberId: number){
    api.get(`/appointments/barber/${barberId}`);
}