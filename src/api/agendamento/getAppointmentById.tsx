import api from "@/api/http-common";

export async function getAppointmentById(id: number) {
    return await api.get(`/appointments/${id}`);
}
