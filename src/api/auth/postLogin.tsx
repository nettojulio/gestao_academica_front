import api from "@/api/http-common";
import { LoginResponse } from "@/interfaces/loginResponse";
import { LoginCredentials } from "@/interfaces/loginCredentials";

export async function postLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    const params = new URLSearchParams();
    params.append('email', credentials.email);
    params.append('senha', credentials.senha);
    
    try {
        const response = await api.post('/auth/login', params, {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
        } catch (error) {
            console.error("Erro na requisição:", error);
            throw error;
        }
}