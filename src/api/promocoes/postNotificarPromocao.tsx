import api from "@/api/http-common";

export async function postNotificarPromocao(id: string) {

    // Verifica se o ID está sendo incluído corretamente na URL
    const url = `/sale/email/notify?idSale=${encodeURIComponent(id)}`;

    try {

        // Enviar a requisição POST
        const response = await api.post(url, {});

        // Retornar a resposta para que possa ser processada pelo handleConfirm
        return response;
        
    } catch (error) {
        // Propagar o erro para o handleConfirm processar
        throw error;
    }
}
