import api from "@/api/http-common";

export async function postAppointment(appointmentData: any) {
    return await api.post("/appointments", appointmentData);
}
