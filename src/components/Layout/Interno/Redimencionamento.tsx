// useWindowDimensions.ts
import { useEffect, useState } from 'react';

type WindowDimensions = {
    width: number | undefined;
    height: number | undefined;
};

const useWindowDimensions = (): WindowDimensions => {
    const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Define as dimensões iniciais
        handleResize();

        // Adiciona o listener de redimensionamento
        window.addEventListener('resize', handleResize);

        // Remove o listener ao desmontar
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
};

export default useWindowDimensions;