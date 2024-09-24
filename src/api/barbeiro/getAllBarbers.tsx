import api from "@/api/http-common";

export async function getAllBarbers(page: number, size: number){
    return await api.get(`/barber?page=${page}&size=${size}`);
}