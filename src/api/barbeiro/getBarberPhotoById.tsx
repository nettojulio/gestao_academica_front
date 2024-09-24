import api from "@/api/http-common";

export async function getBarberPhotoById(id: string) {
    return await api.get(`/barber/${id}/profile-photo`, {
        responseType: 'blob' // Importante para que os dados sejam tratados como um Blob
    });
}
