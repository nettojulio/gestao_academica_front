
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Phone, Settings } from "@mui/icons-material"; // Ícone MUI
import { TextField, MenuItem, Button, Typography, Card } from "@mui/material";
import { useBrazilCities, useBrazilStates } from '@/utils/brasilianStates';



const LayoutHome: React.FC = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
  
    // Estados
    const states = useBrazilStates();
    const [selectedState, setSelectedState] = useState("");
  
    // Cidades (carrega ao selecionar um estado)
    const cities = useBrazilCities(selectedState);
    const [selectedCity, setSelectedCity] = useState("");
  
    useEffect(() => {
      const handleScroll = () => {
        // Verifica se o usuário chegou perto do final da página
        const scrollThreshold = document.documentElement.scrollHeight - window.innerHeight - 300; // 100px antes do final
        setIsVisible(window.scrollY < scrollThreshold);
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
      <>
        <main>
          <section className="bg-neutrals-50 py-24">
            <div className="container mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-start gap-16">
  
              {/* 📄 Texto - Lado Esquerdo */}
              <div className="w-full lg:w-1/2 space-y-10">
                <h1 className="text-headline-large font-extrabold text-neutrals-900 leading-tight">
                  <span className="text-primary-500 text-headline-medium font-bold block">
                    ( WS Consultoria )
                  </span>
                  Para Gestão Pública
                </h1>
  
                <ul className="space-y-6">
                  <li className="flex items-start space-x-3">
                    <Settings className="text-primary-500 w-7 h-7" />
                    <p className="text-body-large text-neutrals-700 leading-relaxed">
                      Facilitamos a gestão pública com tecnologias inovadoras, tornando os processos municipais mais simples, ágeis e eficientes. Nossos sistemas intuitivos são projetados para otimizar a experiência dos servidores, garantindo praticidade e eficiência na administração pública.
                    </p>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Settings className="text-primary-500 w-7 h-7" />
                    <p className="text-body-large font-bold text-neutrals-900 leading-relaxed">
                      Mais de 40 Anos de Experiência
                    </p>
                  </li>
                </ul>
  
                {/* 📌 Botão */}
                <div className="flex justify-center lg:justify-start pt-6">
                  <Link
                    href="http://www.smarapd.com.br/solucoes-gestao-publica"
                    className="inline-block bg-primary-500 hover:bg-primary-700 text-white text-body-large font-bold py-4 px-8 rounded-lg transition"
                  >
                    Quero Mais Informações
                  </Link>
                </div>
              </div>
  
              {/* 📦 Card Gráfico com Background */}
              <div className="w-full lg:w-1/2">
                <div className="relative bg-white shadow-lg rounded-xl overflow-hidden p-8">
  
                  {/* Imagem de Fundo com Hover */}
                  <div className="relative group">
                    <div
                      className="bg-cover bg-center rounded-lg h-64 md:h-80 transition-all duration-500 ease-in-out"
                      style={{
                        backgroundImage:
                          "url('https://img.freepik.com/fotos-premium/equipe-de-diversos-empresarios-atentos-de-raca-mista-ouvindo-seu-chefe-indiano-de-meia-idade_161094-5633.jpg?uid=R154800849&ga=GA1.1.329249892.1734458193&semt=ais_hybrid')",
                      }}
                    />
  
                    {/* Overlay com secondary-500 no hover */}
                    <div className="absolute inset-0 bg-secondary-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                      <p className="text-white text-center text-body-large font-semibold w-4/5">
                        A WS CONSULTORIA domina cada detalhe dos processos e regras de negócio, sempre buscando transformar a complexidade em simplicidade, tornando a gestão mais ágil e eficiente.
                      </p>
                    </div>
                  </div>
  
                  {/* Ícone sobreposto */}
                  <div className="absolute top-0 right-0 transform translate-x-6 -translate-y-6 bg-white shadow-md rounded-full p-5">
                    <div
                      className="w-20 h-20 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://www.smarapd.com.br/uploads/pagina/pagina/2019/03/xboZhd0FhY4EX5Lz/icone_170x170.png')",
                      }}
                    />
                  </div>
  
                  {/* Conteúdo do Card */}
                  <div className="text-center mt-8">
                    <h3 className="text-headline-medium font-bold text-neutrals-900">
                      Soluções ERP Público
                    </h3>
                    <hr className="border-neutrals-200 my-4" />
                    <Link
                      href="erp-para-gestao-publica"
                      className="text-primary-500 text-body-large font-semibold hover:underline"
                    >
                      Conheça nossas Soluções
                    </Link>
                  </div>
  
                </div>
              </div>
            </div>
          </section>
          {/* Seção: Nossos Valores / Institucioal / Navegação Historia */}
  
          <section className="bg-neutrals-50 py-24">
            <div className="container mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-start gap-16">
  
              {/* 📋 Nossos Valores - Lado Esquerdo */}
              <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-xl p-8 border-l-4 border-primary-500">
                <div className="flex flex-col items-center space-y-6">
                  {/* Ícone Principal */}
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/846/846551.png"
                      alt="Valores"
                      className="w-full h-full"
                    />
                  </div>
  
                  <Typography
                    variant="h5"
                    className="text-title-large font-bold text-neutrals-900"
                  >
                    Nossos Valores
                  </Typography>
  
                  {/* Lista de Valores */}
                  <ul className="space-y-3 w-full">
                    {[
                      "Centrado nas pessoas",
                      "Respeito",
                      "Conhecimento",
                      "Ética",
                      "Paixão pela criatividade",
                    ].map((value, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Settings className="text-primary-500 w-6 h-6" />
                        <Typography className="text-body-large text-neutrals-700">
                          {value}
                        </Typography>
                      </li>
                    ))}
                  </ul>
  
                  <Typography className="text-body-large text-neutrals-700 text-center mt-6">
                    Em qualquer situação, uma empresa única.
                  </Typography>
                </div>
              </div>
  
              {/* 📄 Texto Institucional - Centro */}
              <div className="w-full lg:w-1/2 space-y-8">
                <h2 className="text-headline-large font-extrabold text-neutrals-900 leading-tight">
                  <span className="text-primary-500 text-headline-medium font-bold block">
                    ( institucional )
                  </span>
                  A WS CONSULTORIA
                </h2>
  
                <p className="text-body-large text-neutrals-700 leading-relaxed">
                  <strong className="text-neutrals-900">
                    Simplificar está em nosso DNA.
                  </strong>
                  <br />
                  Com mais de 40 anos de experiência, a{" "}
                  <strong className="text-neutrals-900">WS CONSULTORIA</strong>{" "}
                  destaca-se no desenvolvimento de tecnologias e sistemas integrados
                  para gestão pública municipal, garantindo eficiência e otimização
                  dos processos administrativos.
                </p>
  
                <p className="text-body-large text-neutrals-700 leading-relaxed">
                  Estamos entre as principais empresas do setor, com atuação em
                  diversas cidades do Brasil, alinhados às exigências dos órgãos
                  reguladores para uma administração pública moderna e transparente.
                </p>
  
                {/* 📌 Botão */}
                <div className="pt-4">
                  <Link
                    href="/sobre"
                    className="inline-block bg-primary-500 hover:bg-primary-700 text-white text-body-large font-bold py-4 px-8 rounded-lg transition"
                  >
                    Continue Lendo
                  </Link>
                </div>
              </div>
  
              {/* 📦 Cards Numerados - Lado Direito */}
              <div className="w-full lg:w-1/4 space-y-5">
                {[
                  { number: "01", title: "História", description: "Saiba mais sobre a trajetória da WS Consultoria." },
                  { number: "02", title: "Missão e Visão", description: "Entenda nossos valores e compromissos." },
                  { number: "03", title: "Canal de Denúncias", description: "Mantenha a transparência e segurança." },
                  { number: "04", title: "Ouvidoria", description: "Fale conosco e tire suas dúvidas." },
                ].map((item, index) => (
                  <Card
                    key={index}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`relative overflow-hidden rounded-lg p-6 transition-all duration-300 ${hoveredIndex === index
                      ? "bg-primary-500 text-white scale-105"
                      : "bg-white text-neutrals-900"
                      } shadow-lg border-l-4 border-primary-500`}
                  >
                    <div className="flex items-center justify-between">
                      <Typography
                        className={`text-title-large font-bold ${hoveredIndex === index ? "text-white" : "text-neutrals-500"
                          }`}
                      >
                        {item.number}.
                      </Typography>
                      <Typography
                        className={`text-title-medium font-bold ${hoveredIndex === index ? "text-white" : "text-neutrals-900"
                          }`}
                      >
                        {item.title}
                      </Typography>
                    </div>
                    {/* Descrição visível apenas no hover */}
                    {hoveredIndex === index && (
                      <Typography className="mt-3 text-body-large leading-relaxed">
                        {item.description}
                      </Typography>
                    )}
                  </Card>
                ))}
              </div>
  
            </div>
          </section>
  
          {/* Seção: Formulário de Contato / Orçamento */}
  
          <section className="bg-neutrals-50 mx-auto px-6 lg:px-16 py-24">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
              {/* 📞 Cartão Lateral de Contato (Agora aparece antes em telas menores) */}
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
                  <Link
                    href="tel:1621119898"
                    className="text-success-500 font-bold text-title-medium text-primary-700"
                  >
                    (16) 2111-9898
                  </Link>
  
                  <p className="mt-3 text-body-medium text-neutrals-700">
                    Unidade de Soluções em Cobrança
                  </p>
                  <Link
                    href="tel:1621379898"
                    className="text-success-500 font-bold text-title-medium"
                  >
                    (16) 2137-9898
                  </Link>
                </div>
              </div>
  
              {/* ✉️ Formulário de Contato (Agora aparece abaixo em telas menores) */}
              <div className="order-2 lg:order-1 w-full lg:w-2/3 bg-white shadow-lg p-8 rounded-lg">
                <h2 className="text-headline-large font-extrabold text-neutrals-900">
                  <span className="text-primary-500 text-headline-medium font-bold">
                    ( fale conosco )
                  </span>
                  <br />
                  Envie sua Mensagem
                </h2>
                <p className="text-body-medium text-neutrals-600 mt-2">
                  Preencha o formulário que em breve retornaremos o contato.{" "}
                  <span className="font-bold">*Campos obrigatórios</span>
                </p>
  
                {/* Formulário */}
                <form className="mt-6 space-y-6">
                  {/* Nome */}
                  <TextField label="Nome" required fullWidth variant="outlined" className="bg-white" />
  
                  {/* Email */}
                  <TextField label="Email" type="email" required fullWidth variant="outlined" className="bg-white" />
  
                  {/* Telefone e Empresa */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField label="Telefone" required fullWidth variant="outlined" className="bg-white" />
                    <TextField label="Empresa" required fullWidth variant="outlined" className="bg-white" />
                  </div>
  
                  {/* Estado e Cidade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Estado */}
                    <TextField
                      select
                      label="Estado*"
                      required
                      fullWidth
                      variant="outlined"
                      value={selectedState}
                      onChange={(e) => {
                        setSelectedState(e.target.value);
                        setSelectedCity(""); // Resetar cidade ao mudar estado
                      }}
                      className="bg-white"
                    >
                      <MenuItem value="">Selecione um estado</MenuItem>
                      {states.length > 0 ? (
                        states.map((state) => (
                          <MenuItem key={state.sigla} value={state.sigla}>
                            {state.nome}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Carregando...</MenuItem>
                      )}
                    </TextField>
  
                    {/* Cidade */}
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
                        cities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Selecione um estado primeiro</MenuItem>
                      )}
                    </TextField>
                  </div>
  
                  {/* Mensagem */}
                  <TextField label="Mensagem" required fullWidth multiline rows={4} variant="outlined" className="bg-white" />
  
                  {/* Botão de Envio */}
                  <div className="flex justify-end">
                    <Button type="submit" variant="contained" className="bg-primary-500 hover:bg-primary-700 text-white text-body-medium font-bold px-6 py-3 rounded-lg">
                      Enviar
                    </Button>
                  </div>
                </form>
              </div>
              {isVisible && (
                <div className="fixed bottom-10 right-10 bg-white shadow-md rounded-full p-4 z-50 transition-opacity duration-300">
                  <a href="/contato" title="Fale Conosco">
                    <Phone className="text-primary-500 w-8 h-8 cursor-pointer" />
                  </a>
                </div>
              )}
            </div>
          </section>
  
          {/* Outras seções podem ser modularizadas conforme necessário */}
        </main>
      </>
    )
  
  }

  export default LayoutHome;