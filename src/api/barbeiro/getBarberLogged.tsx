import api from "@/api/http-common";

export async function getBarberLogged() {
    return await api.get(`/barber/logged-barber`);
}
