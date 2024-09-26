import api from "@/api/http-common";
import { Secretaria } from "@/interfaces/secretariaInterface";

export async function postSecretariaNoPhoto(secretariaData: Secretaria){
    return await api.post("/secretary/create-without-photo", secretariaData);
}