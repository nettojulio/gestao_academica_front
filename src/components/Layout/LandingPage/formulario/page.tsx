import React, { useEffect, useState } from 'react';
import { Typography, Button, Card, TextField, MenuItem } from "@mui/material";
import { SupportAgent, DirectionsCar, Timeline, Description, Phone } from "@mui/icons-material";
import Link from 'next/link';
import { useBrazilCities, useBrazilStates } from '@/utils/brasilianStates';



// Interface para a Seção de Contato
interface FormularioProps {
    titulo?: string;
    descricao?: string;
    telefone1?: string;
    telefone2?: string;
}


const LayoutFormularioOrcamento: React.FC<FormularioProps> = ({ titulo, descricao, telefone1, telefone2
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    // Estados
    const states = useBrazilStates();
    const [selectedState, setSelectedState] = useState("");

    // Cidades (carrega ao selecionar um estado)
    const cities = useBrazilCities(selectedState);
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            // Verifica se o usuário chegou perto do final da página
            const scrollThreshold = document.documentElement.scrollHeight - window.innerHeight - 300; // 100px antes do final
            setIsVisible(window.scrollY < scrollThreshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <>
            <section className="bg-neutrals-50 mx-auto px-6 lg:px-16 py-24">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
                    {/* 📞 Cartão Lateral de Contato (Agora aparece antes em telas menores) */}
                    <div className="order-1 lg:order-2 w-full lg:w-1/3 bg-white shadow-lg rounded-xl overflow-hidden p-6">
                        <div
                            className="w-full h-60 md:h-72 lg:h-80 xl:h-[300px] bg-center bg-cover md:bg-contain bg-no-repeat rounded-md"
                            style={{
                                backgroundImage:
                                    "url('https://img.freepik.com/vetores-gratis/suporte-ao-cliente-de-ilustracao-de-design-plano_23-2148887720.jpg?uid=R154800849&ga=GA1.1.329249892.1734458193&semt=ais_hybrid')",
                            }}
                        />

                        <div className="text-center mt-6">
                            <h3 className="text-headline-small font-bold text-neutrals-900">
                                Fale Conosco
                            </h3>
                            <hr className="border-neutrals-200 my-3" />

                            <p className="text-body-medium text-neutrals-700">
                                Unidade de Soluções ERP Público
                            </p>
                            <Link
                                href={`tel:${telefone1}`}
                                className="text-success-500 font-bold text-title-medium"
                            >
                                {telefone1}
                            </Link>
                            <p className="mt-3 text-body-medium text-neutrals-700">
                                Unidade de Soluções em Cobrança
                            </p>
                            <Link
                                href={`tel:${telefone2}`}
                                className="text-success-500 font-bold text-title-medium"
                            >
                                {telefone2}
                            </Link>
                        </div>
                    </div>

                    {/* ✉️ Formulário de Contato (Agora aparece abaixo em telas menores) */}
                    <div className="order-2 lg:order-1 w-full lg:w-2/3 bg-white shadow-lg p-8 rounded-lg">
                        <h2 className="text-headline-large font-extrabold text-neutrals-900">
                            <span className="text-primary-500 text-headline-medium font-bold">
                                {titulo}
                            </span>
                            <br />
                            {descricao}
                        </h2>
                        <p className="text-body-medium text-neutrals-600 mt-2">
                            Preencha o formulário que em breve retornaremos o contato.{" "}
                            <span className="font-bold">*Campos obrigatórios</span>
                        </p>

                        {/* Formulário */}
                        <form className="mt-6 space-y-6">
                            {/* Nome */}
                            <TextField label="Nome" required fullWidth variant="outlined" className="bg-white" />

                            {/* Email */}
                            <TextField label="Email" type="email" required fullWidth variant="outlined" className="bg-white" />

                            {/* Telefone e Empresa */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <TextField label="Telefone" required fullWidth variant="outlined" className="bg-white" />
                                <TextField label="Empresa" required fullWidth variant="outlined" className="bg-white" />
                            </div>

                            {/* Estado e Cidade */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Estado */}
                                <TextField
                                    select
                                    label="Estado"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={selectedState}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        setSelectedCity(""); // Resetar cidade ao mudar estado
                                    }}
                                    className="bg-white"
                                >
                                    <MenuItem value="">Selecione um estado</MenuItem>
                                    {states.length > 0 ? (
                                        states.map((state) => (
                                            <MenuItem key={state.sigla} value={state.sigla}>
                                                {state.nome}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Carregando...</MenuItem>
                                    )}
                                </TextField>

                                {/* Cidade */}
                                <TextField
                                    select
                                    label="Cidade"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    disabled={!selectedState || cities.length === 0}
                                    className="bg-white"
                                >
                                    <MenuItem value="">Selecione uma cidade</MenuItem>
                                    {cities.length > 0 ? (
                                        cities.map((city) => (
                                            <MenuItem key={city} value={city}>
                                                {city}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Selecione um estado primeiro</MenuItem>
                                    )}
                                </TextField>
                            </div>

                            {/* Mensagem */}
                            <TextField label="Mensagem" required fullWidth multiline rows={4} variant="outlined" className="bg-white" />

                            {/* Botão de Envio */}
                            <div className="flex justify-end">
                                <Button type="submit" variant="contained" className="bg-primary-500 hover:bg-primary-700 text-white text-body-medium font-bold px-6 py-3 rounded-lg">
                                    Enviar
                                </Button>
                            </div>
                        </form>
                    </div>
                    {isVisible && (
                        <div className="fixed bottom-10 right-10 bg-white shadow-md rounded-full p-4 z-50 transition-opacity duration-300">
                            <a href="/contato" title="Fale Conosco">
                                <Phone className="text-primary-500 w-8 h-8 cursor-pointer" />
                            </a>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default LayoutFormularioOrcamento;
