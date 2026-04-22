import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  // 1. Array com várias imagens de fundo reais (Alta Resolução)
  const bgImages = [
    "https://images.unsplash.com/photo-1540039155732-61ee14b12631?q=80&w=1920&auto=format&fit=crop", // Multidão num concerto
    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1920&auto=format&fit=crop", // Estádio iluminado à noite
    "https://images.unsplash.com/photo-1470229722913-7c090be18a58?q=80&w=1920&auto=format&fit=crop", // Festival de música eletrónica
    "https://images.unsplash.com/photo-1507676184212-d0330a151f84?q=80&w=1920&auto=format&fit=crop", // Palco de teatro/luzes
    "https://images.unsplash.com/photo-1493225457124-a1a2a5f56460?q=80&w=1920&auto=format&fit=crop", // Banda ao vivo
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1920&auto=format&fit=crop"  // Fogo de artifício num evento
  ];

  const [currentBg, setCurrentBg] = useState(0);

  // Função para a próxima imagem
  const nextImage = () => {
    setCurrentBg((prev) => (prev + 1) % bgImages.length);
  };

  // Função para a imagem anterior
  const prevImage = () => {
    setCurrentBg((prev) => (prev - 1 + bgImages.length) % bgImages.length);
  };

  // Temporizador que muda a imagem a cada 5 segundos
  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [currentBg]); // O temporizador reinicia sempre que a imagem muda (ex: quando clicas na seta)

  return (
    <div className="font-sans text-gray-900 bg-white">
      
      {/* Navbar Branca Fixa (Glass Effect) */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm flex justify-between items-center px-8 py-4">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="bg-black text-white p-1 rounded">QP</span> QuickPass
        </div>
        <div className="flex gap-4 items-center font-medium">
          <Link to="/registo" className="hover:underline text-gray-700 hover:text-black">Registar</Link>
          <Link to="/login" className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition shadow-sm">Entrar</Link>
        </div>
      </nav>

      {/* Hero Section Animada */}
      <section className="relative w-full pb-32 pt-48 min-h-[600px] flex flex-col overflow-hidden">
        
        {/* Imagens de fundo a passar */}
        {bgImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-gray-900 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              currentBg === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          ></div>
        ))}

        {/* Camada escura por cima das imagens para o texto ler-se bem */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Gradiente suave no fundo para "derreter" a imagem no branco dos eventos */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent z-0"></div>

        {/* Setas de Navegação */}
        <button 
          onClick={prevImage}
          type="button"
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={nextImage}
          type="button"
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Conteúdo do Hero (Título e Pesquisa) */}
        <div className="relative z-10 flex flex-col h-full text-white justify-center items-center mt-4 px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">QuickPass</h1>
          <p className="text-xl text-gray-100 mb-12 drop-shadow-md">Vive cada momento</p>
          
          {/* Barra de Pesquisa Maior e Flutuante */}
          <form className="w-full max-w-2xl mx-auto px-4">
            <div className="relative flex items-center text-left">
              <svg className="w-6 h-6 text-gray-400 absolute left-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="search" 
                className="w-full py-5 pl-16 pr-36 text-base text-gray-900 bg-white border border-transparent rounded-full focus:outline-none focus:ring-4 focus:ring-gray-300 shadow-2xl transition" 
                placeholder="Pesquisa eventos, artistas ou locais..." 
              />
              <button 
                type="submit" 
                className="absolute right-3 text-white bg-black hover:bg-gray-800 font-bold rounded-full text-sm px-8 py-3.5 transition">
                Procurar
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Eventos em destaque */}
      <section className="relative z-20 max-w-screen-2xl mx-auto px-12 xl:px-24 pb-16 mt-16 pt-16">
        <h2 className="text-2xl font-bold text-center mb-12">Eventos em destaque</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-48 bg-gray-900 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop')"}}></div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Concerto do Travis Scott</h3>
              <p className="text-sm text-gray-600 mb-4 text-balance">Astro mundial da música, vem a Portugal pela primeira vez. Não percas esta oportunidade.</p>
              <a href="#" className="text-sm font-semibold hover:underline">Compra o bilhete →</a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-48 bg-red-600 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&auto=format&fit=crop')"}}></div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Benfica x Porto</h3>
              <p className="text-sm text-gray-600 mb-4 text-balance">Clássico português a não perder. Duas das maiores equipas de Portugal.</p>
              <a href="#" className="text-sm font-semibold hover:underline">Compra o bilhete →</a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-48 bg-purple-600 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop')"}}></div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Super Bock Super Rock</h3>
              <p className="text-sm text-gray-600 mb-4 text-balance">Um dos maiores e mais icónicos festivais de música em Portugal neste Verão.</p>
              <a href="#" className="text-sm font-semibold hover:underline">Compra o bilhete →</a>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="h-48 bg-yellow-600 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=600&auto=format&fit=crop')"}}></div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-2">Espetáculo de Stand Up</h3>
              <p className="text-sm text-gray-600 mb-4 text-balance">Prepara-te para uma noite de gargalhadas. O melhor da comédia nacional num palco.</p>
              <a href="#" className="text-sm font-semibold hover:underline">Compra o bilhete →</a>
            </div>
          </div>

          {/* Card 5 - Brevemente */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-sm border border-gray-200 opacity-80 transition hover:opacity-100">
            <div className="h-48 bg-gray-300 bg-cover bg-center mix-blend-multiply" style={{backgroundImage: "url('https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop')"}}></div>
            <div className="p-6 text-center">
              <h3 className="font-bold text-lg mb-2 text-gray-700">Brevemente</h3>
              <p className="text-sm text-gray-500 mb-4 text-balance">Temos novos eventos incríveis a ser preparados para ti. Fica atento às novidades!</p>
              <span className="text-sm font-semibold text-gray-400 cursor-not-allowed">Aguardar →</span>
            </div>
          </div>

        </div>
      </section>

      {/* Quem somos */}
      <section className="max-w-4xl mx-auto px-8 py-16">
        <p className="text-sm text-gray-500 mb-2 text-center">Conheça a equipa.</p>
        <h2 className="text-3xl font-bold mb-6 text-center">Quem somos?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-10 text-center">
          Somos o André e o José, estudantes de Informática de Gestão, unidos pela vontade de simplificar a forma como as pessoas acedem aos seus eventos favoritos. Este projeto nasce da necessidade de criar uma plataforma de bilhética que seja, acima de tudo, intuitiva e eficiente.<br/><br/>
          Através da tecnologia de códigos QR, eliminamos a burocracia e o papel, garantindo uma experiência de compra rápida e em acesso seguro. Mais do que um site de bilhetes, somos uma ponte tecnológica entre os organizadores e o público, onde a facilidade de utilização é a nossa prioridade.
        </p>
        <div className="flex justify-center gap-16">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-3 mx-auto">
              <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <p className="font-semibold text-sm">André Barreira</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-3 mx-auto">
               <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <p className="font-semibold text-sm">José Fernandes</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-8 mt-10 border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="font-bold flex items-center gap-2 mb-4">
              <span className="bg-black text-white p-1 rounded text-xs">QP</span> QuickPass
            </div>
            <p className="text-gray-600 text-xs text-balance">A sua plataforma de confiança para comprar bilhetes para os melhores eventos em Portugal.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Categorias</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">Música</a></li>
              <li><a href="#" className="hover:underline">Desporto</a></li>
              <li><a href="#" className="hover:underline">Teatro</a></li>
              <li><a href="#" className="hover:underline">Comédia</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Ajuda</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">Centro de ajuda</a></li>
              <li><a href="#" className="hover:underline">Contactos</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:underline">Termos de Serviço</a></li>
              <li><a href="#" className="hover:underline">Política de Privacidade</a></li>
              <li><a href="#" className="hover:underline">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-12">
          © 2026 QuickPass. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}