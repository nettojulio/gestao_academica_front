import api from "@/api/http-common";

export async function getAppointmentsByBarberId(barberId: number) {
    return await api.get(`/appointments/barber/${barberId}`);
}
