import api from "@/api/http-common";

export async function postLogin(credentials: any) {
    return await api.post("/auth", credentials);
}