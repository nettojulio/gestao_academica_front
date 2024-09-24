import api from "@/api/http-common";

export function getAllProdutos(page: number, size: number) {
    return  api.get(`/product?page=${page}&size=${size}`);
}
