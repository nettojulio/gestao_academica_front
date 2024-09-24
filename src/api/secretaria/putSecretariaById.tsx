import axios from "axios";
import { getStorageItem } from "@/utils/localStore";
import { Secretaria } from "@/interfaces/secretariaInterface";

export async function putSecretariaById(id: string | number | undefined, secretaria: Secretaria, profilePhoto: File) {
  const token = getStorageItem("token"); 

  const formData = new FormData();
  const secretariaJson = JSON.stringify(secretaria);

  // Adiciona a string JSON no campo `barber`
  formData.append("secretary", secretariaJson);

  // Adiciona a imagem no campo `profilePhoto`
  formData.append("profilePhoto", profilePhoto);

  try {
    const response = await axios.put(
      `https://go-barber-api.onrender.com/secretary/${id}`,
      formData,
      {
        headers: {
          "Authorization": `${token}`, 
          "Content-Type": "multipart/form-data", // Mantém o Content-Type adequado para envio de FormData
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    throw error;
  }
}
