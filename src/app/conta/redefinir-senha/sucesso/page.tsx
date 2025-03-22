import Link from "next/link";

import '../../auth-styles.css';

export default function PageRegister() {

    return (
        <div className="flex flex-col items-center justify-center px-6 pt-10 mx-auto dark:bg-gray-900">
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h1 className="text-2xl font-bold custom-text-color dark:text-white">
                    A nova senha foi definida com sucesso!
                </h1>
                <div className="container">
                    <p>Agora você pode realizar o login no SmartApSUS para efetuar operações avançadas.</p>
                </div>
                <div className="container">
                    <Link href="/home" className="custom-text-color text-sm">Ir para Entrar</Link>
                </div>
            </div>
        </div>
    );
}
