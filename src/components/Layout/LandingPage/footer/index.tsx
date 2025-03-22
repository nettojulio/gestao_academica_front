import Link from "next/link";

import { Facebook, Instagram, LinkedIn, Lock, YoutubeSearchedFor } from "@mui/icons-material";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="bg-primary-700 text-white py-10">
            <div className="container mx-auto px-6 lg:px-16 flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:justify-between">
                {/* Logo */}
                <div className="flex flex-col items-center lg:items-start">
                    <Image
                        src="/assets/crosshairs-gps.png"
                        alt="Logo WS"
                        width={60}
                        height={60}
                    />
                </div>

                {/* Links de Navegação */}
                <div className="flex flex-wrap justify-center lg:justify-start space-x-6">
                    <Link href="#" className="text-body-medium font-semibold hover:underline">
                        Home
                    </Link>
                    <Link href="#" className="text-body-medium font-semibold hover:underline">
                        Nossas Soluções
                    </Link>
                    <Link href="#" className="text-body-medium font-semibold hover:underline">
                        Contato
                    </Link>
                    <Link href="#" className="text-body-medium font-semibold hover:underline flex items-center">
                        <Lock className="mr-1" /> Área do Cliente
                    </Link>
                </div>

                {/* Redes Sociais */}
                <div className="flex space-x-4">
                    <Link href="#">
                        <Facebook className="w-6 h-6 text-white hover:text-primary-300 transition" />
                    </Link>
                    <Link href="#">
                        <YoutubeSearchedFor className="w-6 h-6 text-white hover:text-primary-300 transition" />
                    </Link>
                    <Link href="#">
                        <Instagram className="w-6 h-6 text-white hover:text-primary-300 transition" />
                    </Link>
                    <Link href="#">
                        <LinkedIn className="w-6 h-6 text-white hover:text-primary-300 transition" />
                    </Link>
                </div>
            </div>

            {/* Informações Legais */}
            <div className="container mx-auto px-6 lg:px-16 text-center mt-6 text-body-small text-neutrals-200">
                <p>
                    Utilizamos utiliza cookies e outras tecnologias semelhantes para melhorar sua experiência. Ao continuar
                    navegando, você concorda com estas condições.
                </p>
                <p className="mt-2">
                    Responsável WS Consultoria - Walfredo -
                    <Link href="mailto:dpo@smarapd.com.br" className="font-bold hover:underline">
                        wsconsultoria@gmail.com.br
                    </Link>
                </p>
                <p className="mt-2">
                    <Link href="/politica-privacidade" className="font-bold hover:underline">
                        Política de Privacidade - Clique aqui e acesse
                    </Link>
                </p>
            </div>

            {/* Direitos Autorais */}
            <div className="bg-primary-900 text-center py-4 text-body-small text-neutrals-300">
                <p>Todos os direitos reservados - Copyright © 2025</p>
            </div>
        </footer>
    );
};

export default Footer;
