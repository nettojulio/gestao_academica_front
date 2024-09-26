import api from "@/api/http-common";

export async function getBarberPhotoLogged() {
    return await api.get(`/barber/logged-barber/picture`, {
        responseType: 'blob' // Importante para que os dados sejam tratados como um Blob
    });
}
