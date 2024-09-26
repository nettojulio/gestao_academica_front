import api from "@/api/http-common";

export async function getPromocaoByCupom(coupon: string | string[] | undefined) {
    return await api.get(`/sale/coupon/${coupon}`);
}