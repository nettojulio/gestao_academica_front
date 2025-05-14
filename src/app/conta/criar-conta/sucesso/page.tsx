import Link from "next/link";
import '../../auth-styles.css';

export default function PageRegister() {
    return (
        <div className="flex flex-col items-center justify-center px-6 pt-10 mx-auto text-center">
            <div className="w-full max-w-xl p-6 space-y-12 sm:p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold custom-text-color dark:text-white">
                    Conta criada com sucesso!
                </h1>
                <div className="container text-base">
                    <p>Parabéns! Sua conta foi criada com sucesso! Confira o seu email para fazer a validação de login!</p>
                    <p>Agora você pode realizar o login no Sistema de Gestão Universitária clicando no botão logo abaixo ou indo para a tela de login.</p>
                </div>
                <div className="flex justify-center">
                    <Link href="/login">
                        <button className="py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                            Ir para a tela de login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
