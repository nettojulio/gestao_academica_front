import axios from "axios";
import { useEffect, useState } from "react";

export interface Estado {
  sigla: string;
  nome: string;
}

export function useBrazilStates() {
  const [states, setStates] = useState<Estado[]>([]);

  useEffect(() => {
    axios
      .get("https://brasilapi.com.br/api/ibge/uf/v1")
      .then((response) => setStates(response.data))
      .catch((error) => console.error("Erro ao buscar estados:", error));
  }, []);

  return states;
}

export function useBrazilCities(uf: string) {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (uf) {
      axios
        .get(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`)
        .then((response) =>
          // Mapeia os dados para obter apenas o nome da cidade
          setCities(response.data.map((city: any) => city.nome))
        )
        .catch((error) => console.error("Erro ao buscar municípios:", error));
    } else {
      setCities([]);
    }
  }, [uf]);

  return cities;
}
export interface EstadoInfo {
  nome: string;
  uf: string;
}

export function useEstadoByMunicipio(municipio: string) {
  const [estado, setEstado] = useState<EstadoInfo | null>(null);

  useEffect(() => {
    if (municipio) {
      axios
        .get("https://brasilapi.com.br/api/ibge/municipios/v1/")
        .then((response) => {
          // Procura o município ignorando diferenças de maiúsculas/minúsculas
          const found = response.data.find((m: any) =>
            m.nome.toLowerCase() === municipio.toLowerCase()
          );
          if (found && found.microrregiao?.mesorregiao?.UF) {
            setEstado({
              nome: found.microrregiao.mesorregiao.UF.nome,
              uf: found.microrregiao.mesorregiao.UF.sigla,
            });
          } else {
            setEstado(null);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar município:", error);
          setEstado(null);
        });
    } else {
      setEstado(null);
    }
  }, [municipio]);

  return estado;
}

export interface EnderecoInfo {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  estado: string;
  // Outras propriedades retornadas pela API podem ser adicionadas se necessário.
}

export function useEnderecoByCep(cep: string) {
  const [endereco, setEndereco] = useState<EnderecoInfo | null>(null);

  useEffect(() => {
    // Remove caracteres não numéricos e verifica se o CEP possui 8 dígitos
    const cepNumeros = cep.replace(/\D/g, "");
    if (cepNumeros.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${cepNumeros}/json/`)
        .then((response) => {
          if (response.data.erro) {
            setEndereco(null);
          } else {
            setEndereco(response.data);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar CEP:", error);
          setEndereco(null);
        });
    } else {
      setEndereco(null);
    }
  }, [cep]);

  return endereco;
}