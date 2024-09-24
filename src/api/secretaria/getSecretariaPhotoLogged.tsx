import api from "@/api/http-common";

export async function getSecretariaPhotoLogged() {
    return await api.get(`/secretary/logged-secretary/picture`, {
        responseType: 'blob' // Importante para que os dados sejam tratados como um Blob
    });
}
