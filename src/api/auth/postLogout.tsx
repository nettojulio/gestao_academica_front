import api from "@/api/http-common";

export async function postLogout() {
    return await api.post("/auth/logout");
}