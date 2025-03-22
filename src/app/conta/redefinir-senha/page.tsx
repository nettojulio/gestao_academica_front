import { genericaApiAuth } from "@/utils/api";
import router from "next/router";
import { FormEvent, useEffect, useState } from "react";

import '../auth-styles.css';

export default function PageRegister() {
    const [errorMessageSenha, setErrorMessageSenha] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [formData, setFormData] = useState<any>({
        novaSenha: "",
        repetirSenha: "",
    });
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");

    // Pegar o token da query string da URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent < HTMLInputElement | HTMLSelectElement > ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setFormData({
                ...formData,
                [name]: e.target.checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setErrorMessageSenha(null);

        if (!mostrarSenha && formData.novaSenha !== formData.repetirSenha) 
        {
            setErrorMessageSenha("A nova senha e a confirmação não correspondem");

            return;
        }

        const formDataWithToken = {
            ...formData,
            "token" : token
        };

        const body = {
            metodo: 'post',
            uri: '/reset/changePassword',
            params: {},
            data: formDataWithToken
        };

        const response = await genericaApiAuth(body);

        if (response.status && response.status === 500)
            setErrorMessage(response.data.message);
        else 
        if (response.data.errors) 
        {
            // Tratando erros individuais para cada campo
            const errors = response.data.errors;
            if (errors.novaSenha) setErrorMessage(errors.novaSenha);

            console.error("#1-Erro ao realizar a operação:" + JSON.stringify(errors));
        } 
        else 
        if (response.data.error) 
        {
            console.error("#2-Erro ao realizar a operação:", response.data.error.message);
            setErrorMessage("Erro ao redefinir a senha. " + response.data.error.message);
        } 
        else 
        if (response.data.detail) 
        {
            console.error(`#3-Erro ao realizar a operação: ${response.data.detail}`);
            setErrorMessage(`${response.data.detail}`);
        } 
        else 
        if (response.status === 200) 
            router.push('/conta/redefinir-senha/sucesso');
        else
        {
            console.error("NÃO DEVERIA CAIR AQUI");
            console.log(JSON.stringify(response));

            if (response.status === 400)
                console.log(JSON.stringify(response.data));
            else
                console.log(`${response.data.detail}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 pt-10 mx-auto dark:bg-gray-900">
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h2 className="text-2xl font-bold custom-text-color dark:text-white">
                    Redefinir Senha
                </h2>
                <div className="container">
                    {token && (
                        <div>
                            <p className="text-sm text-gray-700">Token de recuperação (tabela 'auth_password_reset_token'):</p>
                            <p className="text-sm text-gray-700 font-bold">{token}</p>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <label htmlFor="novaSenha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Informe a nova senha</label>
                        <input type={mostrarSenha ? "text" : "password"} name="novaSenha" id="novaSenha" value={formData.novaSenha} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required/>
                        <button type="button" className="absolute right-2 top-9 text-sm text-gray-700" onClick={() => setMostrarSenha(!mostrarSenha)}>
                            {mostrarSenha ? 'ocultar' : 'exibir'}
                        </button>
                        {errorMessageSenha && <p className="text-red-500 text-sm mt-2">{errorMessageSenha}</p>}
                    </div>
                    {!mostrarSenha && (
                        <div>
                            <label htmlFor="repetirSenha" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repita a nova senha</label>
                            <input type="password" name="repetirSenha" id="repetirSenha" value={formData.repetirSenha} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required/>
                        </div>
                    )}
                    <button type="submit" className="w-full px-5 py-2 text-base font-medium text-center text-white rounded-lg sm:w-auto custom-blue-purple-button">Redefinir senha</button>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
}
