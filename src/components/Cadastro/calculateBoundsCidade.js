    // Função para calcular os limites da cidade
    // É utilizada apenas quando os dados das coordenadas da cidade já existirem no banco de dados
    export default function calculateBoundsCidade(coordinates) 
    {
        let minLat = Infinity, maxLat = -Infinity;
        let minLng = Infinity, maxLng = -Infinity;

        // Função recursiva para iterar através de todas as camadas de coordenadas
        function processCoordinates(coordArray) 
        {
            coordArray.forEach(coord => 
            {   
                if (Array.isArray(coord[0]))
                    processCoordinates(coord); // Se o elemento é um array, chama a função recursivamente
                else 
                {
                    const [lng, lat] = coord;

                    if (lat < minLat) minLat = lat;
                    if (lat > maxLat) maxLat = lat;
                    if (lng < minLng) minLng = lng;
                    if (lng > maxLng) maxLng = lng;
                }
            });
        }

        processCoordinates(coordinates);

        return {
            northEast: [maxLat, minLng],
            southWest: [minLat, maxLng]
        };
    }