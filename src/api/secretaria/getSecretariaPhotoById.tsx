import api from "@/api/http-common";

export async function getSecretariaPhotoById(id: string) {
    return await api.get(`/secretary/${id}/profile-photo`, {
        responseType: 'blob' // Importante para que os dados sejam tratados como um Blob
    });
}
