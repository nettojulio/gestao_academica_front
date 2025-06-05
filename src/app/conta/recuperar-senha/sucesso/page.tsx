import Link from "next/link";

import '../../auth-styles.css';

export default function PageRegister() {

    return (
        <div className="flex flex-col items-center justify-center px-6 pt-10 mx-auto dark:bg-gray-900">
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h1 className="text-2xl font-bold custom-text-color dark:text-white">
                    Token de recuperação gerado com sucesso!
                </h1>
                <div className="container">
                    <p>Um token de recuperação foi gerado e enviado para o email informado.</p><br/>
                    <p>Por favor, verifique a caixa de entrada do e-mail e utilize o link fornecido para cadastrar uma nova senha.</p>
                </div>
                <div className="container">
                    <Link href="/home" className="custom-text-color text-sm">Ir para Entrar</Link><br/>
                    <Link href="/conta/redefinir-senha?token=pegarotokennobanco" className="custom-text-color text-sm">Redefinir senha (para testes, pegar o token no banco)</Link>
                </div>
            </div>
        </div>
    );
}
