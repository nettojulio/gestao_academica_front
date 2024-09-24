import api from "@/api/http-common";

export async function getSecretariaLogged() {
    return await api.get(`/secretary/logged-secretary`);
}
