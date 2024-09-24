import api from "@/api/http-common";

export function getAllServicos(page: number, size: number) {
    return  api.get(`/services?page=${page}&size=${size}`);
}

