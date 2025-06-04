import { useState } from 'react';
import { useRouter } from 'next/navigation';

function ModalTipo() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    return (
        <div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg w-full max-w-md mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-5 text-center">Qual o tipo?</h2>

                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={() => {
                                    router.push("/prae/auxilio/tipos-de-bolsa")
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded flex-1 hover:bg-blue-600 transition-colors"
                            >
                                Tipo de bolsa
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded flex-1 hover:bg-blue-600 transition-colors"
                            >
                                Tipo de Auxílio
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModalTipo;