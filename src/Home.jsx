import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EVENTS, formatDate } from './eventsData';

export default function Home() {
  const navigate = useNavigate();

  // --- LÓGICA DE AUTENTICAÇÃO ---
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.reload();
  };

  const bgImages = [
    "/img/img1.jpg",
    "/img/img2.jpg",
    "/img/img3.jpg",
    "/img/img4.jpg",
    "/img/img5.jpg",
    "/img/img6.jpg"
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Estados da pesquisa
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const nextImage = () => setCurrentBg((prev) => (prev + 1) % bgImages.length);
  const prevImage = () => setCurrentBg((prev) => (prev - 1 + bgImages.length) % bgImages.length);

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [currentBg]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const filtered = EVENTS.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.district.toLowerCase().includes(query.toLowerCase()) ||
        event.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4);
      setSearchResults(filtered);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/eventos');
  };

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      
      {/* NAVBAR INTELIGENTE */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10 shadow-sm flex justify-between items-center px-8 py-4 text-white">
        <div className="text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
        </div>
        <div className="flex gap-5 items-center font-medium">
          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Bem-vindo, <span className="text-white font-bold">{userName || 'Utilizador'}</span>
              </span>
              <button 
                onClick={handleLogout} 
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest border border-red-400/30 px-3 py-1.5 rounded-full hover:bg-red-400/10 cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/registo" className="text-gray-300 hover:text-white transition-colors">Registar</Link>
              <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition shadow-sm font-semibold">Entrar</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative w-full pb-32 pt-48 min-h-[600px] flex flex-col z-20">
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          {bgImages.map((img, index) => (
            <div key={index} className={`absolute inset-0 w-full h-full bg-gray-900 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${currentBg === index ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url('${img}')` }}></div>
          ))}
          <div className="absolute inset-0 bg-gray-900/60"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-100 to-slate-100/0"></div>
        </div>

        <button onClick={prevImage} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <button onClick={nextImage} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>

        <div className="relative z-40 flex flex-col h-full text-white justify-center items-center mt-4 px-12 text-center">
          <div className="flex flex-col items-center mb-16">
            <h1 className="text-6xl md:text-8xl font-extrabold !m-0 !p-0 leading-none !text-white tracking-tight [text-shadow:_0_4px_12px_rgba(0,0,0,0.8)]">QuickPass</h1>
            <p className="text-xl md:text-2xl font-semibold !mt-2 !mb-0 !text-white [text-shadow:_0_2px_6px_rgba(0,0,0,0.8)] opacity-90">Vive cada momento</p>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto px-4 relative">
            <div className="relative flex items-center text-left z-50">
              <svg className="w-6 h-6 text-gray-400 absolute left-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="search" 
                value={searchQuery}
                onChange={handleSearchChange}
                autoComplete="off"
                className="w-full py-5 pl-16 pr-36 text-base text-gray-900 bg-white border border-transparent rounded-full focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-2xl transition" 
                placeholder="Pesquisa eventos, artistas ou locais..." 
              />
              <button type="submit" className="absolute right-3 text-white bg-black hover:bg-gray-800 font-bold rounded-full text-sm px-8 py-3.5 transition">Procurar</button>
            </div>

            {searchQuery.length > 0 && (
              <div className="absolute top-full left-4 right-4 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[100] text-left animate-in fade-in slide-in-from-top-4 duration-200">
                {searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    {searchResults.map((event) => (
                      <Link 
                        key={event.id} 
                        to={`/eventos/${event.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <img src={event.image} alt={event.title} className="w-14 h-14 rounded-xl object-cover shadow-sm" />
                        <div>
                          <p className="font-bold text-gray-900 text-base">{event.title}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                            <span className="text-green-600">★ {event.rating}</span> • {formatDate(event.date)} • {event.district}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <Link to="/eventos" className="block w-full text-center p-4 text-sm font-bold text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">
                      Ver todos os resultados para "{searchQuery}" →
                    </Link>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-gray-900 font-bold mb-1">Nenhum resultado encontrado</p>
                    <p className="text-gray-500 text-sm">Não encontrámos nenhum evento para "{searchQuery}".</p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="bg-slate-100 py-24 relative z-10">
        <div className="max-w-screen-2xl mx-auto px-8 xl:px-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Eventos em destaque</h2>
              <p className="text-gray-500 mt-2 text-lg">Os bilhetes mais procurados do momento em Portugal.</p>
            </div>
            <Link to="/eventos" className="text-sm font-semibold text-black hover:underline mb-2">Ver todos os eventos →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <Link to="/eventos/1" className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{backgroundImage: "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&q=80')"}}></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Música</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">14 Fev • Altice Arena</p>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Concerto do Travis Scott</h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow">Astro mundial da música vem a Portugal pela primeira vez.</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <span className="font-bold text-lg">90€</span>
                  <span className="text-sm font-bold text-black group-hover:underline">Comprar</span>
                </div>
              </div>
            </Link>

            <Link to="/eventos/2" className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-red-800 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{backgroundImage: "url('https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&q=80')"}}></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Desporto</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">17 Mar • Estádio da Luz</p>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Benfica x Porto</h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow">Clássico português a não perder. Duas das maiores equipas.</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <span className="font-bold text-lg">55€</span>
                  <span className="text-sm font-bold text-black group-hover:underline">Comprar</span>
                </div>
              </div>
            </Link>

            <Link to="/eventos/3" className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-purple-900 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{backgroundImage: "url('https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80')"}}></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Festival</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">18 Mai • Algés</p>
                <h3 className="font-bold text-xl mb-2 text-gray-900">NOS Alive</h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow">Um dos festivais mais prestigiados da Europa.</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <span className="font-bold text-lg">79€</span>
                  <span className="text-sm font-bold text-black group-hover:underline">Comprar</span>
                </div>
              </div>
            </Link>

            <Link to="/eventos/4" className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-yellow-700 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{backgroundImage: "url('https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=600&q=80')"}}></div>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Comédia</div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">26 Nov • Coliseu do Porto</p>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Levanta-te e Ri</h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow">Uma noite de gargalhadas garantidas ao vivo e sem filtros.</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                  <span className="font-bold text-lg">25€</span>
                  <span className="text-sm font-bold text-black group-hover:underline">Comprar</span>
                </div>
              </div>
            </Link>

            <Link to="/eventos" className="group bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden border border-gray-200 border-dashed flex flex-col items-center justify-center p-8 text-center transition-opacity opacity-80 hover:opacity-100">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800">Mais a caminho...</h3>
              <p className="text-sm text-gray-500 text-balance">Estamos a preparar dezenas de novos eventos. Fica atento!</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 shadow-sm relative z-10">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4 block">Sobre a Plataforma</span>
          <h2 className="text-4xl font-extrabold mb-8 text-gray-900">Nascidos para simplificar.</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-16">
            Somos o André e o José, estudantes de Informática de Gestão, unidos pela vontade de revolucionar o acesso a eventos. O projeto <span className="font-bold text-black">QuickPass</span> nasceu para eliminar burocracias, bilhetes de papel perdidos e filas intermináveis, usando tecnologia QR segura e intuitiva.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16">
            <div className="flex flex-col items-center group">
              <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 overflow-hidden">
                <img src="/img/andre.jpg" alt="André Barreira" className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-gray-900 text-lg">André Barreira</p>
              <p className="text-sm text-gray-500">Co-Fundador</p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg flex items-center justify-center mb-4 group-hover:-translate-y-2 transition-transform duration-300 overflow-hidden">
                <img src="/img/jose.jpg" alt="José Fernandes" className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-gray-900 text-lg">José Fernandes</p>
              <p className="text-sm text-gray-500">Co-Fundador</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-24 border-t border-slate-200">
        <div className="max-w-screen-2xl mx-auto px-8 xl:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">A voz dos nossos clientes</h2>
            <p className="text-gray-500 text-lg">A confiança de milhares de portugueses que já vivem o momento connosco.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300 flex flex-col">
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed flex-grow text-balance text-sm">"Comprei bilhetes para o festival num instante! O site não bloqueou, o processo foi super intuitivo e o bilhete em QR code no telemóvel funcionou perfeitamente na entrada. Recomendo muito."</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs tracking-widest shadow-sm">MC</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Mariana Costa</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-wide font-semibold mt-0.5"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Compra Verificada</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300 flex flex-col">
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed flex-grow text-balance text-sm">"Farto de sites complicados e bilhetes em papel. A QuickPass veio resolver isso. O design do site é espetacular, muito rápido de navegar, e a carteira digital é brilhante."</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-bold text-xs tracking-widest border-2 border-white shadow-sm">DP</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Diogo Pereira</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-wide font-semibold mt-0.5"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Compra Verificada</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-gray-200/50 transition-shadow duration-300 flex flex-col">
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(4)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
                <svg className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </div>
              <p className="text-gray-700 mb-8 leading-relaxed flex-grow text-balance text-sm">"Muito fácil de usar. Só gostava que tivessem mais eventos de teatro na minha zona, mas para concertos e futebol já não uso outra coisa. O apoio ao cliente foi impecável."</p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs tracking-widest shadow-sm">AR</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Ana Rita</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-wide font-semibold mt-0.5"><svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Compra Verificada</p>
                </div>
              </div>
            </div>

            <div className="group bg-transparent p-8 rounded-3xl border-2 border-dashed border-gray-300 hover:border-black hover:bg-white transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-black text-gray-400 group-hover:text-white rounded-full flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">A tua opinião conta!</h3>
              <p className="text-sm text-gray-500 mb-8 text-balance">Já foste a algum evento connosco? Partilha a tua experiência e ajuda-nos a melhorar.</p>
              <button onClick={() => setShowReviewModal(true)} className="text-sm font-bold text-gray-700 border border-gray-300 rounded-full px-6 py-2.5 group-hover:bg-black group-hover:text-white group-hover:border-black transition-colors duration-300 w-full">
                Escrever Avaliação
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-16 px-8 border-t border-gray-900 mt-auto">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-sm">
          <div className="lg:col-span-2">
            <div className="text-xl font-bold flex items-center gap-2 mb-6 text-white"><span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass</div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">A tua plataforma de bilhética 100% digital. Rapidez, segurança e sustentabilidade no acesso aos teus eventos favoritos.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white tracking-wider uppercase text-xs">Categorias</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Música & Festivais</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Desporto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Teatro & Arte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Comédia</a></li>
            </ul>
          </div>
          <div>
            <Link to="/suporte" className="block font-bold mb-6 text-white tracking-wider uppercase text-xs hover:text-gray-300 hover:underline underline-offset-4 transition-all w-max cursor-pointer">Suporte</Link>
            <ul className="space-y-3">
              <li><Link to="/suporte#ajuda" className="hover:text-white transition-colors">Centro de Ajuda</Link></li>
              <li><Link to="/suporte#qr" className="hover:text-white transition-colors">Como funciona o QR</Link></li>
              <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Contactos</button></li>
              <li><Link to="/suporte#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white tracking-wider uppercase text-xs">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Termos e Condições</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gestão de Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} QuickPass Portugal. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* --- POP-UPS --- */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowReviewModal(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowReviewModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Avalia a tua experiência</h3>
            <p className="text-gray-500 text-sm mb-8">A tua opinião ajuda-nos a melhorar e ajuda outros utilizadores.</p>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Classificação</label>
                <div className="flex gap-2 text-gray-300">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-8 h-8 hover:text-yellow-400 cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="review" className="block text-sm font-bold text-gray-900 mb-2">O teu comentário</label>
                <textarea id="review" rows="4" className="w-full p-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-inner resize-none transition-shadow" placeholder="Conta-nos como foi a tua experiência na plataforma..."></textarea>
              </div>
              <button type="button" onClick={() => setShowReviewModal(false)} className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition shadow-sm mt-4">Enviar Avaliação</button>
            </form>
          </div>
        </div>
      )}

      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowContactModal(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowContactModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Contactos</h3>
            <p className="text-gray-500 text-sm mb-8">Precisas de falar connosco? Aqui tens os nossos detalhes.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4"><div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div><div><h4 className="font-bold text-gray-900 text-sm">Email</h4><a href="mailto:suporte@quickpass.pt" className="text-gray-600 text-sm hover:text-black hover:underline transition-colors">suporte@quickpass.pt</a></div></div>
              <div className="flex items-start gap-4"><div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><h4 className="font-bold text-gray-900 text-sm">Morada</h4><p className="text-gray-600 text-sm">Avenida da Liberdade, 100<br/>1250-096 Lisboa, Portugal</p></div></div>
              <div className="flex items-start gap-4"><div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg></div><div><h4 className="font-bold text-gray-900 text-sm">Fax</h4><p className="text-gray-600 text-sm">+351 210 000 000</p></div></div>
            </div>
            <button type="button" onClick={() => setShowContactModal(false)} className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition shadow-sm mt-10">Fechar</button>
          </div>
        </div>
      )}

    </div>
  );
}