import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AccountBalance, AccountBalanceWallet, Assignment, Business, BusinessCenter, Description, LocalGasStation, Phone, ReceiptLong, Savings, Settings, StoreMallDirectory, WaterDrop } from "@mui/icons-material"; // Ícone MUI
import { TextField, MenuItem, Button, Typography, Card } from "@mui/material";
import { useBrazilCities, useBrazilStates } from '@/utils/brasilianStates';
import Image from 'next/image';



const LayoutSolucoes: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Estados
  const states = useBrazilStates();
  const [selectedState, setSelectedState] = useState("");

  // Cidades (carrega ao selecionar um estado)
  const cities = useBrazilCities(selectedState);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (states.length < 0) {
      const states = useBrazilStates();

    }
    const handleScroll = () => {
      // Verifica se o usuário chegou perto do final da página
      const scrollThreshold = document.documentElement.scrollHeight - window.innerHeight - 300; // 100px antes do final
      setIsVisible(window.scrollY < scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const solutions = [
    { icon: <ReceiptLong className="text-primary-500 text-4xl" />, title: "Contabilidade Pública", link: "/nossos-sistemas/e-Contp" },
    { icon: <LocalGasStation className="text-primary-500 text-4xl" />, title: "Gestão de Combustível", link: "/nossos-sistemas/e-Frotas" },
    { icon: <BusinessCenter className="text-primary-500 text-4xl" />, title: "Folha de Pagamento", link: "/nossos-sistemas/e-Rh" },
    { icon: <Description className="text-primary-500 text-4xl" />, title: "Nota Fiscal Eletrônica", link: "/nossos-sistemas/e-Nfs" },
    { icon: <Assignment className="text-primary-500 text-4xl" />, title: "Gestão de Contratos", link: "/nossos-sistemas/e-Contratos" },
    { icon: <StoreMallDirectory className="text-primary-500 text-4xl" />, title: "Gestão de Patrimônio", link: "/nossos-sistemas/e-Patrimonio" },

    // { icon: "\uD83D\uDCB8", title: "Tributação Pública", link: "#" },
    // { icon: "\uD83D\uDCE7", title: "Peticionamento Eletrônico", link: "#" },
    // { icon: "\uD83D\uDCB2", title: "Tributo ISS", link: "#" },
    // { icon: "\uD83D\uDCDE", title: "Atendimento ao Cidadão", link: "#" },
    // { icon: "\u26B0\uFE0F", title: "Gestão de Cemitérios Municipais", link: "#" },
    // { icon: "\uD83D\uDCE6", title: "Gestão de Compras por Licitações", link: "#" },
  ];
  const areasAtuacao = [
    { icon: <Business fontSize="large" className="text-primary-500" />, title: "Prefeituras", description: "Atendimento especializado para administrações municipais." },
    { icon: <AccountBalanceWallet fontSize="large" className="text-primary-500" />, title: "Câmaras Municipais", description: "Soluções para gestão legislativa e transparência pública." },
    { icon: <AccountBalance fontSize="large" className="text-primary-500" />, title: "Autarquias Fundações", description: "Ferramentas inovadoras para gestão autárquica." },

    { icon: <Savings fontSize="large" className="text-primary-500" />, title: "Previdências Municipais", description: "Gestão de previdência para servidores públicos." },
  ];

  return (
    <>
      {/* Seção: Cabeçalho Soluções*/}

      <section className="bg-white py-24">
        <div className="container mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-12">
          {/* 📄 Texto - Lado Esquerdo */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-headline-large font-extrabold text-neutrals-900 leading-tight">
              <span className="text-primary-500 text-headline-medium font-bold block">
                ( soluções gestão pública )
              </span>
              Simplificar a Gestão Pública
            </h1>

            <ul className="space-y-4">
              <li className="flex items-start space-x-2">
                <Settings className="text-primary-500 w-6 h-6" />
                <p className="text-body-large text-neutrals-700">
                  Transformamos a gestão pública com o desenvolvimento de tecnologias que simplificam todos os processos da administração. Para isso, contamos com a participação ativa da nossa gente, que contribui com sua expertise e empatia.
                </p>
              </li>
            </ul>
          </div>

          {/* 💻 Imagem - Lado Direito */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg">
              <img
                src="https://img.freepik.com/vetores-gratis/conceito-ilustrado-de-cms-em-design-plano_23-2148800725.jpg?uid=R154800849&ga=GA1.1.329249892.1734458193&semt=ais_authors_boost"
                alt="Notebook com WS Consultoria"
                className="w-full object-contain"
              />
              {/* Logo Sobreposta */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src="https://www.smarapd.com.br/uploads/pagina/pagina/2019/03/xboZhd0FhY4EX5Lz/icone_170x170.png"
                                    alt="Logo SmarAPD"
                                    className="w-40 h-40"
                                />
                            </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Clientes / Fale Conosco */}

      <section className="bg-neutrals-50 py-24">
        <div className="container mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-start gap-16">

          {/* 📋 Card de Contato - Lado Esquerdo */}
          <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-xl overflow-hidden">
            <div
              className="w-full h-48 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://img.freepik.com/fotos-premium/homem-em-chame-centro_23-2148094804.jpg?uid=R154800849&ga=GA1.1.329249892.1734458193&semt=ais_authors_boost')",
              }}
            />
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto -mt-12 bg-white shadow-md rounded-full flex items-center justify-center">
                
              </div>

              <h3 className="text-title-large font-bold text-neutrals-900 mt-4">
                Tem Interesse? <br /> Fale Conosco
              </h3>

              <p className="text-body-large text-neutrals-700 mt-4">
                Basta preencher um formulário que em breve retornaremos o contato com mais informações.
              </p>

              <div className="mt-6">
                <Link
                  href="/contato"
                  className="text-primary-500 font-bold text-title-medium hover:underline"
                >
                  Entrar em Contato
                </Link>
              </div>
            </div>
          </div>

          {/* 📌 Clientes - Centro/Direita */}
          <div className="w-full lg:w-3/4">
            <h2 className="text-headline-large font-extrabold text-neutrals-900 leading-tight">
              <span className="text-primary-500 text-headline-medium font-bold block">
                ( clientes )
              </span>
              Que Utilizam Nossas Soluções
            </h2>

            {/* 📜 Texto Descritivo */}
            <p className="text-body-large text-neutrals-700 mt-4">
              Nossa experiência no mercado nos permitiu atender diversos municípios com soluções inovadoras e eficientes.
              Abaixo, destacamos alguns de nossos clientes, representados por seus respectivos brasões.
            </p>

            {/* Grid de Logos dos Municípios */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
              {[
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bras%C3%A3o_de_Mato_Grosso.svg/120px-Bras%C3%A3o_de_Mato_Grosso.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bras%C3%A3o_de_S%C3%A3o_Carlos_%28S%C3%A3o_Paulo%29.svg/120px-Bras%C3%A3o_de_S%C3%A3o_Carlos_%28S%C3%A3o_Paulo%29.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Bras%C3%A3o_de_Ouro_Fino.svg/120px-Bras%C3%A3o_de_Ouro_Fino.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Bras%C3%A3o_de_Santa_B%C3%A1rbara_d%27Oeste.svg/120px-Bras%C3%A3o_de_Santa_B%C3%A1rbara_d%27Oeste.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Bras%C3%A3o_de_Atibaia.png/120px-Bras%C3%A3o_de_Atibaia.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Bras%C3%A3o_de_Limeira.svg/120px-Bras%C3%A3o_de_Limeira.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Bras%C3%A3o_de_Campinas.svg/120px-Bras%C3%A3o_de_Campinas.svg.png",
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Bras%C3%A3o_de_Piracicaba.svg/120px-Bras%C3%A3o_de_Piracicaba.svg.png",
              ].map((logo, index) => (
                <div key={index} className="bg-white shadow-md rounded-xl p-4 flex items-center justify-center">
                  <img src={logo} alt="Brasão Município" className="w-24 h-24 object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Seção: Nossos Sistemas */}

      <section className="bg-white py-20 px-6 lg:px-16">
        <div className="container mx-auto">
          {/* Título */}
          <Typography variant="h4" className="font-bold text-neutrals-900 text-center mb-10">
            <span className="text-primary-500">( soluções )</span>
            <br /> Que Oferecemos
          </Typography>

          {/* Grid Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card
                key={index}
                className="flex items-center justify-between p-6 shadow-md border border-neutrals-200 rounded-lg 
          transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-center space-x-5">
                  <span className="text-4xl">{solution.icon}</span>
                  <Typography className="text-body-large text-neutrals-800 font-semibold">
                    {solution.title}
                  </Typography>
                </div>
                <Link
                  href={solution.link}
                  className="text-primary-500 text-body-large font-bold hover:underline"
                >
                  Ver Mais
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Seção: Aréas de Atuação */}
      <section className="bg-neutrals-50 py-24">
        <div className="container mx-auto px-8 lg:px-20">
          {/* Título */}
          <div className="text-center mb-12">
            <Typography variant="h4" className="font-bold text-neutrals-900">
              <span className="text-primary-500">( áreas )</span>
              <br /> De Atuação
            </Typography>
          </div>

          {/* Cards */}
          <div className="flex flex-wrap justify-center gap-8">
            {areasAtuacao.map((area, index) => (
              <Card
                key={index}
                className="w-full sm:w-1/2 lg:w-1/4 xl:w-1/5 p-12 rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center relative group overflow-hidden transform hover:scale-105 duration-300"
              >
                <div className="w-32 h-32 flex items-center justify-center bg-white shadow-md rounded-full mb-6 transition-transform duration-300 group-hover:scale-110">
                  {area.icon}
                </div>
                <Typography variant="h6" className="font-semibold text-neutrals-900">
                  {area.title}
                </Typography>
                <div className="absolute inset-0 bg-primary-500 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 rounded-xl">
                  <Typography className="text-body-medium text-center font-bold leading-relaxed">
                    {area.description}
                  </Typography>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Seção: Formulário de Contato / Orçamento */}

      <section className="bg-neutrals-50 mx-auto px-6 lg:px-16 py-24">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* 📞 Cartão Lateral de Contato */}
          <div className="order-1 lg:order-2 w-full lg:w-1/3 bg-white shadow-lg rounded-xl overflow-hidden p-6">
            <div
              className="w-full h-60 md:h-72 lg:h-80 xl:h-[300px] bg-center bg-cover md:bg-contain bg-no-repeat rounded-md"
              style={{
                backgroundImage:
                  "url('https://img.freepik.com/vetores-gratis/suporte-ao-cliente-de-ilustracao-de-design-plano_23-2148887720.jpg?uid=R154800849&ga=GA1.1.329249892.1734458193&semt=ais_hybrid')",
              }}
            />
            <div className="text-center mt-6">
              <h3 className="text-headline-small font-bold text-neutrals-900">
                Fale Conosco
              </h3>
              <hr className="border-neutrals-200 my-3" />

              <p className="text-body-medium text-neutrals-700">
                Unidade de Soluções ERP Público
              </p>
              <a
                href="tel:1621119898"
                className="text-success-500 font-bold text-title-medium text-primary-700"
              >
                (16) 2111-9898
              </a>

              <p className="mt-3 text-body-medium text-neutrals-700">
                Unidade de Soluções em Cobrança
              </p>
              <a
                href="tel:1621379898"
                className="text-success-500 font-bold text-title-medium"
              >
                (16) 2137-9898
              </a>
            </div>
          </div>

          {/* ✉️ Formulário de Contato */}
          <div className="order-2 lg:order-1 w-full lg:w-2/3 bg-white shadow-lg p-8 rounded-lg">
            <h2 className="text-headline-large font-extrabold text-neutrals-900">
              <span className="text-primary-500 text-headline-medium font-bold">
                ( fale conosco )
              </span>
              <br />
              Seu Orçamento
            </h2>
            <p className="text-body-medium text-neutrals-600 mt-2">
              Preencha o formulário que em breve retornaremos o contato.{" "}
              <span className="font-bold">*Campos obrigatórios</span>
            </p>



            {/* Formulário */}
            <form className="mt-6 space-y-6">
              <TextField
                label="Nome*"
                required
                fullWidth
                variant="outlined"
                className="bg-white"
              />
              <TextField
                label="Email*"
                type="email"
                required
                fullWidth
                variant="outlined"
                className="bg-white"
              />

              {/* Telefone e Empresa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Telefone"
                  required
                  fullWidth
                  variant="outlined"
                  className="bg-white"
                />
                <TextField
                  label="Empresa"
                  required
                  fullWidth
                  variant="outlined"
                  className="bg-white"
                />
              </div>

              {/* Estado e Cidade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  select
                  label="Estado*"
                  required
                  fullWidth
                  variant="outlined"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity("");
                  }}
                  className="bg-white"
                >
                  <MenuItem value="">Selecione um estado</MenuItem>
                  {states.map((state) => (
                    <MenuItem key={state.sigla} value={state.sigla}>
                      {state.nome}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Cidade*"
                  required
                  fullWidth
                  variant="outlined"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={!selectedState || cities.length === 0}
                  className="bg-white"
                >
                  <MenuItem value="">Selecione uma cidade</MenuItem>
                  {cities.length > 0 ? (
                    cities.map((city, index) => (
                      <MenuItem key={index} value={city}>
                        {city}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Selecione um estado primeiro</MenuItem>
                  )}
                </TextField>
              </div>

              <TextField
                label="Mensagem*"
                required
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                className="bg-white"
              />

              {/* Botão de Envio */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="contained"
                  className="bg-primary-500 hover:bg-primary-700 text-white text-body-medium font-bold px-6 py-3 rounded-lg transition"
                >
                  Enviar
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Botão Flutuante (exibido apenas se isVisible for true) */}
        {isVisible && (
          <div className="fixed bottom-10 right-10 bg-white shadow-md rounded-full p-4 z-50 transition-opacity duration-300 hover:bg-primary-500">
            <a href="/contato" title="Fale Conosco">
              <Phone className="text-primary-500 hover:text-white w-8 h-8 cursor-pointer" />
            </a>
          </div>
        )}
      </section>

    </>
  );
};

export default LayoutSolucoes;