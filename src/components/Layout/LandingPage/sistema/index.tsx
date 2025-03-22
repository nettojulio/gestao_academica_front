import React from 'react';
import { Typography, Button, Card } from "@mui/material";
import { SupportAgent, DirectionsCar, Timeline, Description, Phone } from "@mui/icons-material";
import LayoutFormularioOrcamento from '../formulario/page';


// Interface para as Funcionalidades
interface FuncionalidadeProps {
  icone: JSX.Element;
  descricao: string;
}

// Interface Principal do Componente
interface SistemaProps {
  tituloSecao?: string;
  subtituloSecao?: string;
  descricaoSecao?: string;
  imagemSecao?: string;

  tituloDiferencial?: string;
  descricaoDiferencial?: string;
  imagemDiferencial?: string;

  tituloInteresse?: string;
  descricaoInteresse?: string;
  iconeInteresse?: JSX.Element;

  tituloFuncionalidades?: string;
  funcionalidades?: FuncionalidadeProps[];

  tituloOrcamento?: string;
  descricaoOrcamento?: string;
  telefone1?: string;
  telefone2?: string;
}

const LayoutSistema: React.FC<SistemaProps> = ({ tituloSecao, subtituloSecao, descricaoSecao, imagemSecao, tituloDiferencial, descricaoDiferencial, imagemDiferencial, tituloInteresse, descricaoInteresse, iconeInteresse, tituloFuncionalidades, funcionalidades = [], tituloOrcamento, descricaoOrcamento, telefone1, telefone2
}) => {
  return (
    <>
      {/* Seção Principal */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-12">
          {/* 📄 Texto - Lado Esquerdo */}
          <div className="w-full lg:w-1/2 space-y-6">
            {tituloSecao && (
              <Typography variant="h4" className="font-extrabold text-neutrals-900 leading-tight">
                <span className="text-primary-500 text-headline-medium font-bold block">
                  ({tituloSecao})
                </span>
                {subtituloSecao}
              </Typography>
            )}
            {descricaoSecao && <Typography className="text-body-large text-neutrals-700">{descricaoSecao}</Typography>}
          </div>
          {/* 💻 Imagem - Lado Direito */}
          {imagemSecao && (
            <div className="w-full lg:w-1/2 flex justify-center">
              <img src={imagemSecao} alt="Sistema" className="w-full max-w-lg object-cover rounded-lg shadow-lg" />
            </div>
          )}
        </div>
      </section>
      {/* Seção de Interesse */}
      <section className="bg-neutrals-50 py-20 px-6 lg:px-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
          {/* Ícone */}
          <div className="w-full lg:w-1/5 flex justify-center">
            <div className="bg-white p-8 rounded-full shadow-lg">{iconeInteresse}</div>
          </div>

          {/* Texto */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <Typography variant="h5" className="font-bold text-neutrals-900">{tituloInteresse}</Typography>
            <Typography className="text-body-large text-neutrals-700 mt-4">{descricaoInteresse}</Typography>
          </div>

          {/* Botão */}
          <div className="w-full lg:w-1/5 flex justify-center">
            <Button variant="contained" className="bg-primary-500 hover:bg-primary-700 text-white px-6 py-3 rounded-lg">
              Solicitar Cotação
            </Button>
          </div>
        </div>
      </section>
      {/* Seção Diferencial */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-6">
            <Typography variant="h4" className="font-extrabold text-neutrals-900">
              {tituloDiferencial}
            </Typography>
            <Typography className="text-body-large text-neutrals-700">{descricaoDiferencial}</Typography>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img src={imagemDiferencial} alt="Diferencial" className="w-full max-w-lg object-cover rounded-lg " />
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="bg-neutrals-50 py-24">
        <div className="container mx-auto px-8 lg:px-20">
          <Typography variant="h4" className="font-extrabold text-neutrals-900 text-center">
            {tituloFuncionalidades}
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {funcionalidades.map((func, index) => (
              <div key={index} className="flex space-x-4 items-start">
                <span className="text-primary-500 text-4xl">{func.icone}</span>
                <Typography className="text-body-large text-neutrals-700">{func.descricao}</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Orçamento */}
      <LayoutFormularioOrcamento titulo={tituloOrcamento} descricao={descricaoOrcamento} telefone1={telefone1} telefone2={telefone2}/>
    </>
  );
};

export default LayoutSistema;
