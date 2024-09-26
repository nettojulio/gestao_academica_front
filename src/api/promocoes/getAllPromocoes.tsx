import api from "@/api/http-common";

export function getAllPromocoes(page: number, size: number) {
    return  api.get(`/sale?page=${page}&size=${size}`);
}
