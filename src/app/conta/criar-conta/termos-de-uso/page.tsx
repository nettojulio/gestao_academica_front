
"use client"
import { useEffect, useState } from 'react';
import '../../auth-styles.css';

export default function PageRegister() {
    const [isPopup, setIsPopup] = useState<boolean>(false);

    useEffect(() => {
        function checkIfPopup() {
            if (typeof window !== 'undefined') { 
                const hasOpener = !!window.opener;
                const isSmallWindow = window.innerWidth < 600 && window.innerHeight < 600;
                return hasOpener || isSmallWindow;
            }

            return false;
        }
    
        setIsPopup(checkIfPopup());
    }, []);

    const closePopup = () => {
        if (window.opener) {
          window.close();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 pt-10 mx-auto dark:bg-gray-900">
            <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
                <h3 className="text-2xl font-bold custom-text-color dark:text-white">
                    Termos de uso
                </h3>
                <div className="container">
                    <p><strong>1. Introdução</strong></p>
                    <p>Bem-vindo aos termos de uso da SmartApSUS. Estes termos governam o uso do nosso aplicativo web.</p>
                    
                    <p><strong>2. Uso do Aplicativo</strong></p>
                    <p>O uso deste aplicativo está sujeito aos seguintes termos:</p>
                    <ul>
                        <li>Os conteúdos do aplicativo são apenas para informação geral.</li>
                        <li>As informações podem ser modificadas sem aviso prévio.</li>
                        <li>Nem nós, nem terceiros, garantimos a precisão, atualidade, desempenho, integralidade ou adequação das informações e materiais encontrados ou oferecidos neste aplicativo para qualquer finalidade específica.</li>
                    </ul>
                    
                    <p><strong>3. Limitações de Responsabilidade</strong></p>
                    <p>Não nos responsabilizamos por danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos que surjam do uso ou da incapacidade de usar este aplicativo.</p>
                    
                    <p><strong>4. Links</strong></p>
                    <p>Este aplicativo pode conter links para outros sites que não são mantidos ou controlados por nós. Não temos controle sobre o conteúdo, políticas de privacidade ou práticas de sites de terceiros e não assumimos responsabilidade por eles.</p>
                    
                    <p><strong>5. Modificações dos Termos</strong></p>
                    <p>Podemos revisar estes termos de uso a qualquer momento atualizando esta página. Você concorda em ficar vinculado à versão atualizada desses termos.</p>
                    
                    <p><strong>6. Lei Aplicável</strong></p>
                    <p>Estes termos são regidos e interpretados de acordo com as leis do seu país, sem levar em consideração seus conflitos de disposições legais.</p>
                    
                    <p><strong>7. Contato</strong></p>
                    <p>Se você tiver dúvidas sobre estes termos de uso, entre em contato conosco através dos nossos canais de suporte.</p>
                </div>
                {isPopup && (
                    <div className="container">
                        <a onClick={closePopup} className="custom-text-color text-sm cursor-pointer">
                        Fechar
                        </a>
                    </div>
                )}
                {/* <div className="container">
                    <Link href="/conta/criar-conta" className="custom-text-color text-sm">Voltar</Link>
                </div> */}
            </div>
        </div>
    );
}
