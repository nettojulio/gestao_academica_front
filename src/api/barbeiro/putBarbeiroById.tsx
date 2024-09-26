import axios from "axios";
import { Barbeiro } from "@/interfaces/barbeiroInterface";
import { getStorageItem } from "@/utils/localStore";

export async function putBarberbeiroById(id: string | number | undefined, barber: Barbeiro, profilePhoto: File) {
  const token = getStorageItem("token"); 

  const formData = new FormData();
  const barberJson = JSON.stringify(barber);

  // Adiciona a string JSON no campo `barber`
  formData.append("barber", barberJson);

  // Adiciona a imagem no campo `profilePhoto`
  formData.append("profilePhoto", profilePhoto);

  try {
    const response = await axios.put(
      `https://go-barber-api.onrender.com/barber/${id}`,
      formData,
      {
        headers: {
          "Authorization": `${token}`, 
          "Content-Type": "multipart/form-data", // Mantém o Content-Type adequado para envio de FormData
        },
      }
    );

    console.log("Resposta do servidor:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
    throw error;
  }
}
