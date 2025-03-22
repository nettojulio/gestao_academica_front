import Link from 'next/link';
import { Card, Typography, Button } from "@mui/material";
import {
  ReceiptLong,
  LocalGasStation,
  BusinessCenter,
  Description,
  Assignment,
  StoreMallDirectory
} from "@mui/icons-material";

const LayoutSistemaCards: React.FC = () => {
  const areasAtuacao = [
    { icon: <ReceiptLong className="text-primary-500 text-4xl" />, title: "Sistema e-Contp", link: "https://tinuvens.ddns.net/login.xhtml" },
    { icon: <LocalGasStation className="text-primary-500 text-4xl" />, title: "Sistema e-Frotas", link: "/e-Frotas" },
    { icon: <BusinessCenter className="text-primary-500 text-4xl" />, title: "Sistema e-Rh", link: "https://tinuvens.ddns.net/erh/login.xhtml" },
    { icon: <Description className="text-primary-500 text-4xl" />, title: "Sistema e-Nfs", link: "https://tinuvens.ddns.net/enfs/login.xhtml" },
    { icon: <Assignment className="text-primary-500 text-4xl" />, title: "Sistema e-Contratos", link: "https://tinuvens.ddns.net/econtratos/login.xhtml" },
    { icon: <StoreMallDirectory className="text-primary-500 text-4xl" />, title: "Sistema e-Patrimonio", link: "https://tinuvens.ddns.net/epatrimonial/login.xhtml" },
  ];

  return (
    <section className="bg-neutrals-50 py-24">
      <div className="container mx-auto px-8 lg:px-20">
        {/* Título */}
        <div className="text-center mb-12">
          <Typography 
            variant="h4" 
            className="font-bold text-neutrals-900 text-display-small"
          >
            <span className="text-primary-500">( Acessar )</span>
            <br />
            Sistemas
          </Typography>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {areasAtuacao.map((area, index) => (
            <Card
              key={index}
              className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 p-8 rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 flex items-center justify-center bg-white shadow-md rounded-full mb-4 transition-transform duration-300 hover:scale-110">
                  {area.icon}
                </div>
                <Typography 
                  variant="h6"
                  className="font-semibold text-neutrals-900 text-title-medium mb-4 whitespace-nowrap"
                >
                  {area.title}
                </Typography>
                <Link href={area.link} passHref>
                  <Button 
                    variant="contained" 
                    className="bg-primary-500 hover:bg-primary-700 transition-colors duration-300"
                  >
                    Acessar Sistema
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LayoutSistemaCards;
