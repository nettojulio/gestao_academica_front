import api from "@/api/http-common";

export function getAllEstoqueByProductId(page: number, size: number, id: string | string[] | undefined) {
    return  api.get(`/stock/product/${id}?page=${page}&size=${size}`);
}
