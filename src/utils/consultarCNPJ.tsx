// Exemplo de hook useEmpresaByCnpj (já existente)
import axios from "axios";
import { useEffect, useState } from "react";

export interface EmpresaInfo {
  cnpj: string;
  nome_fantasia: string;
  razao_social: string;
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  numero: string;
  municipio: string;
  uf: string;
  ddd_telefone_1: string;
  email: string;
  // Outros campos que a API retornar, se necessário.
}

export function useEmpresaByCnpj(cnpj: string) {
  const [empresa, setEmpresa] = useState<EmpresaInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const cnpjNumeros = cnpj.replace(/\D/g, "");
    if (cnpjNumeros.length === 14) {
      setLoading(true);
      axios
        .get(`https://brasilapi.com.br/api/cnpj/v1/${cnpjNumeros}`)
        .then((response) => {
          setEmpresa(response.data);
          setError(null);
        })
        .catch((error) => {
          console.error("Erro ao buscar CNPJ:", error);
          setEmpresa(null);
          setError(error);
        })
        .finally(() => setLoading(false));
    } else {
      setEmpresa(null);
    }
  }, [cnpj]);
  return { empresa, loading, error };
}
