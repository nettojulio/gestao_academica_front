"use client"
import { FormEvent, useState } from "react";


import '../auth-styles.css';
import Link from "next/link";
import { genericaApiAuth } from "@/utils/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import TermosDeUso from "@/app/conta/criar-conta/termos-de-uso/page";

const openPopup = (url: any) => {
    window.open(url, 'popup', 'width=600,height=600,scrollbars=no,resizable=no');
};

export default function PageRegister() {
    const router = useRouter();
    const [errorMessageEmail, setErrorMessageEmail] = useState<string | null>(null);
    const [errorMessageSenha, setErrorMessageSenha] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [formData, setFormData] = useState<any>({
        nome: "",
        nomeSocial: "",
        cpf: "",
        telefone: "",
        email: "",
        repetirEmail: "",
        senha: "",
        repetirSenha: "",
        termosUso: false
    });
    const [mostrarSenha, setMostrarSenha] = useState<boolean>(false);

    const handleClickTermosDeUso = (e: any) => {
        e.preventDefault();
        openPopup('/conta/criar-conta/termos-de-uso');
    };

    const formatarCPF = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const formatarTelefone = (value: string) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    };

    const handleMask = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "cpf") {
            newValue = formatarCPF(value);
        } else if (name === "telefone") {
            newValue = formatarTelefone(value);
        }

        setFormData({
            ...formData,
            [name]: newValue
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    function validarTelefone(telefone: string) {
        const apenasNumeros = telefone.replace(/\D/g, '');
        return apenasNumeros.length === 11;
    }

    const validarCPF = (cpf: string) => {
        cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setErrorMessageEmail(null);
        setErrorMessageSenha(null);

        if (!validarCPF(formData.cpf)) {
            toast.error("CPF inválido!", { position: "top-right" });
            return;
        }

        if (!validarTelefone(formData.telefone)) {
            toast.error("Telefone inválido!", { position: "top-right" });
            return;
        }

        if (formData.senha.length < 8) {
            toast.error("A senha deve ter pelo menos 8 caracteres!", { position: "top-right" });
            return;
        }

        if (!formData.termosUso) {
            setErrorMessage("Você deve ler e aceitar os Termos de Uso antes de criar uma conta");
            return;
        }
        if (formData.email !== formData.repetirEmail) {
            toast.error("O e-mail e a confirmação não correspondem");
            setErrorMessageEmail("O e-mail e a confirmação não correspondem");
            return;
        }
        if (!mostrarSenha && formData.senha !== formData.repetirSenha) {
            setErrorMessageSenha("A senha e a confirmação não correspondem");
            return;
        }

        const formDataWithDate = {
            ...formData,
        };

        const body = {
            metodo: 'post',
            uri: '/usuario',
            params: {},
            data: formDataWithDate
        };

        const response = await genericaApiAuth(body);

        console.log("response: " + JSON.stringify(response));

        if (response.status === 401) {
            toast.error("Credenciais já cadastradas!", { position: "top-right" });
            return;
        }

        if (response.status === 409) {
            toast.error("CPF e/ou e-mail já cadastrado(s)!", { position: "top-right" });
            return;
        }

        if (response.status && response.status === 500) {
            if (response.data && response.data.message)
                setErrorMessage(response.data.message);
            else
                setErrorMessage(response.data);
        }
        if (response.data.errors) {
            const errors = response.data.errors;
            if (errors.email) setErrorMessageEmail(errors.email);
            if (errors.senha) setErrorMessageSenha(errors.senha);
            console.error("#1 " + JSON.stringify(errors));
        } else if (response.data.error) {
            console.error("#2 " + 'Erro ao salvar registro:', response.data.error.message);
            setErrorMessage("Erro ao criar a conta. " + response.data.error.message);
        } else if (response.data.detail) {
            console.error(`Erro: ${response.data.detail}`);
            setErrorMessage(`${response.data.detail}`);
        } else if (response.status === 201) {
            router.push('/conta/criar-conta/sucesso');
        } else {
            console.log(JSON.stringify(response));
            if (response.status === 400)
                console.log(JSON.stringify(response.data));
            else
                console.log(`${response.data.detail}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-4 bg-gray-100 mt-10 mb-11">
            <div className="max-w-[110em] w-full p-10 space-y-8 sm:p-12 bg-white rounded-lg shadow">
                {/* <Link href="/">
                    <img src="/logo/logo_1.png" className='mb-4 mx-auto block' alt="smartApSUS" width={120} />
                </Link>
                <h1 className="text-gray-400 text-center text font-normal">Descubra informações essenciais sobre sua região, incluindo unidades de Atenção Primária à Saúde, profissionais de saúde e muito mais.</h1> */}

                <h2 className="text-2xl font-bold custom-text-color">
                    Nova conta
                </h2>
                <form onSubmit={handleSubmit} className=" mt-2 space-y-2" style={{ marginTop: '9px' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-900">Nome <span className="text-red-500">*</span></label>
                            <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" required />
                        </div>
                        <div>
                            <label htmlFor="nomeSocial" className="block mb-2 text-sm font-medium text-gray-900">Nome Social</label>
                            <input type="text" name="nomeSocial" id="nomeSocial" value={formData.nomeSocial} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" />
                        </div>
                        <div>
                            <label htmlFor="cpf" className="block mb-2 text-sm font-medium text-gray-900">CPF <span className="text-red-500">*</span></label>
                            <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleMask} maxLength={14} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" required />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block mb-2 text-sm font-medium text-gray-900">Telefone <span className="text-red-500">*</span></label>
                            <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleMask} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" placeholder="(00) 00000-0000" maxLength={15} required />
                        </div>
                        <div className="relative">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">E-mail <span className="text-red-500">*</span></label>
                            <input type="email" name="email" id="email" placeholder="email@ufape.edu.br" value={formData.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" required />
                            {errorMessageEmail && <p className="text-red-500 text-sm mt-2">{errorMessageEmail}</p>}

                        </div>
                        <div>
                            <label htmlFor="repetirEmail" className="block mb-2 text-sm font-medium text-gray-900">Repetir E-mail <span className="text-red-500">*</span></label>
                            <input type="email" name="repetirEmail" id="repetirEmail" value={formData.repetirEmail} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" required />
                        </div>
                        <div className="relative">
                            <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-900">Senha <span className="text-red-500">*</span></label>
                            <input type={mostrarSenha ? "text" : "password"} name="senha" id="senha" value={formData.senha} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" required />
                            <button type="button" className="absolute right-2 top-9 text-sm text-gray-700" onClick={() => setMostrarSenha(!mostrarSenha)}>
                                {mostrarSenha ? 'ocultar' : 'Exibir'}
                            </button>
                            {errorMessageSenha && <p className="text-red-500 text-sm mt-2">{errorMessageSenha}</p>}
                        </div>
                        {!mostrarSenha && (
                            <div>
                                <label htmlFor="repetirSenha" className="block mb-2 text-sm font-medium text-gray-900">Repetir senha <span className="text-red-500">*</span></label>
                                <input type="password" name="repetirSenha" id="repetirSenha" value={formData.repetirSenha} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5" required />
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2 custom-text-color">Termos de Uso e Privacidade</h3>
                        <div className="h-[40em] overflow-y-scroll border bg-gray-50 rounded-lg">
                            <TermosDeUso />
                        </div>
                        <div className="flex items-center mt-2">
                            <div className="flex items-center mt-1">
                                <input type="checkbox" name="termosUso" id="termosUso" checked={formData.termosUso} onChange={handleChange} className="mr-2" />
                                <label htmlFor="termosUso" className="text-sm font-medium text-gray-900">Declaro que li e aceito os Termos de Uso</label>
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto  pt:mt-0">
                        {/* <Link href="/conta/criar-conta/termos-de-uso" className="custom-text-color underline text-sm">Termos de Uso</Link> */}
                        <Link href="/conta/criar-conta/termos-de-uso" target="_blank" rel="noopener noreferrer" className="custom-text-color underline text-sm">
                            Os termos estão disponíveis acima, mas você pode acessá-los também clicando aqui.
                        </Link>

                    </div>
                    <button type="submit"
                        className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                        Criar Conta</button>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                </form>
            </div>
        </div>
    );
}
