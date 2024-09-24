import { Secretaria } from "@/interfaces/secretariaInterface";
import { getStorageItem } from "@/utils/localStore";

export async function postSecretaria(secretaria: Secretaria, profilePhoto:File) {


  const token = getStorageItem("token"); 
  // Cria um objeto FormData para enviar o objeto JSON e a imagem
  const formData = new FormData();

  // Converte o objeto `barber` para uma string JSON
  const secretariaJson = JSON.stringify(secretaria);

  // Adiciona o JSON e a imagem ao FormData
  formData.append("secretary", secretariaJson);
  formData.append("profilePhoto", profilePhoto, profilePhoto.name);

  try {
    // Faz a requisição usando fetch
    const response = await fetch("https://go-barber-api.onrender.com/secretary", {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "*/*",
        // Note que não definimos o "Content-Type" porque o navegador faz isso automaticamente com multipart/form-data
        "Authorization": `${token}`,

      },
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao enviar a requisição:", error);
  }
}
