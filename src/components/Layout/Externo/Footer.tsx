import React from 'react';
import Link from 'next/link';
import theme from "@/theme/theme";
import Image from 'next/image';

const Footer = ({ dados }: any) => {
    return (
        <footer className="bg-primary-900 text-white py-6 px-6 md:px-10 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-shrink-0">
                    <Image src="/assets/LogoBranca.svg" alt="Logo Ufape" width={120} height={50} />
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                    <Image src="/assets/LogoUfape.svg" alt="Logo Ufape" width={40} height={40} />
                    <Image src="/assets/LogoLmts.svg" alt="Logo LMTS" width={80} height={40} />
                </div>
                <div className="flex flex-wrap justify-center md:justify-end gap-4">
                    <Link href="#" className="hover:opacity-80 transition">
                        <Image src="/assets/icons/facebook.svg" alt="Facebook Icon" width={24} height={24} />
                    </Link>
                    <Link href="#" className="hover:opacity-80 transition">
                        <Image src="/assets/icons/instagram.svg" alt="Instagram Icon" width={24} height={24} />
                    </Link>
                    <Link href="#" className="hover:opacity-80 transition">
                        <Image src="/assets/icons/Email.svg" alt="Email Icon" width={27} height={26} />
                    </Link>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
