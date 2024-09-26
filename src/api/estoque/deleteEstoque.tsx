import api from "@/api/http-common";

export async function deleteEstoque(id: string | string[] | undefined) {
    return await api.delete(`/stock/${id}`);
}