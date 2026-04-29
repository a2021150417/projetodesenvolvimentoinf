import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, Star, ChevronLeft, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';
import { getEventById, formatDateLong } from './eventsData';
import { useCart } from './CartContext';

export default function EventDetalhes() {
  const { id } = useParams();
  const event = getEventById(id);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [selectedTicket, setSelectedTicket] = useState(null);

  // --- LÓGICA DE AUTENTICAÇÃO ---
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.reload();
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
        <h1 className="text-3xl font-bold mb-4">Evento não encontrado</h1>
        <Link to="/eventos" className="text-green-500 hover:underline font-bold">← Voltar aos eventos</Link>
      </div>
    );
  }

  const handleBuyTicket = () => {
    if (!selectedTicket) return;

    const itemForCart = {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventImage: event.image,
      ticketType: selectedTicket.name,
      price: selectedTicket.price,
      quantity: 1
    };

    addToCart(itemForCart);
    navigate('/carrinho');
  };

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      
      {/* NAVBAR INTELIGENTE */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10 shadow-sm flex justify-between items-center px-8 py-4 text-white">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
        </Link>
        <div className="flex gap-5 items-center font-medium">
          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Bem-vindo, <span className="text-white font-bold">{userName}</span>!
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

      {/* HERO DO EVENTO */}
      <section className="relative w-full h-[65vh] min-h-[550px] flex items-end pb-20 pt-32 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gray-900/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-screen-xl mx-auto px-8 w-full">
          <Link to="/eventos" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm mb-8 transition-colors [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)]">
            <ChevronLeft className="w-4 h-4" /> Voltar aos eventos
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/30">
              {event.category}
            </span>
            {event.trending && (
              <span className="px-4 py-1.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/10">
                Em Alta
              </span>
            )}
          </div>
          
          <h1 
            className="text-5xl md:text-8xl font-extrabold tracking-tight mb-4 leading-[0.9]"
            style={{ color: '#ffffff', textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}
          >
            {event.title}
          </h1>
          
          <p 
            className="text-xl md:text-2xl font-semibold max-w-3xl opacity-95"
            style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}
          >
            {event.shortDescription}
          </p>
        </div>
      </section>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-screen-xl mx-auto px-8 py-16 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16">
          
          <div className="space-y-12">
            <div className="flex flex-wrap gap-8 py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center"><Calendar className="w-5 h-5 text-black" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Data</p>
                  <p className="font-bold text-gray-900">{formatDateLong(event.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center"><Clock className="w-5 h-5 text-black" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Horário</p>
                  <p className="font-bold text-gray-900">Portas: {event.doorsOpen} | Início: {event.startTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center"><MapPin className="w-5 h-5 text-black" /></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Local</p>
                  <p className="font-bold text-gray-900">{event.venue}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Sobre o evento</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{event.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Localização</h2>
              <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100 flex items-start gap-4">
                <MapPin className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">{event.venue}</p>
                  <p className="text-gray-500">{event.address}</p>
                  <p className="text-gray-500">{event.district}, Portugal</p>
                </div>
              </div>
            </div>
          </div>

          {/* DIREITA: Bilhetes */}
          <div>
            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-2xl shadow-gray-200/50 p-8 sticky top-32">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">A partir de</p>
                  <p className="text-4xl font-black text-gray-900">{event.price}€</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 border-none" /> {event.rating}
                </div>
              </div>

              {event.ticketsLeft < 50 && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 mb-6 border border-red-100">
                  <Flame className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-sm">Quase Esgotado!</p>
                    <p className="text-xs">Restam apenas {event.ticketsLeft} bilhetes disponíveis.</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Escolhe o teu bilhete:</h3>
                
                {event.ticketTypes.map((ticket) => {
                  const isSelected = selectedTicket?.id === ticket.id;
                  
                  return (
                    <div 
                      key={ticket.id} 
                      onClick={() => setSelectedTicket(ticket)}
                      className={`group flex justify-between items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-black bg-white shadow-lg ring-4 ring-black/5' 
                          : 'border-transparent bg-slate-50 hover:bg-white hover:border-gray-200'
                      }`}
                    >
                      <div>
                        <p className={`font-bold ${isSelected ? 'text-black' : 'text-gray-900'}`}>{ticket.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{ticket.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-lg text-gray-900">{ticket.price}€</p>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-black bg-black' : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleBuyTicket}
                disabled={!selectedTicket}
                className={`w-full font-bold text-lg py-4 rounded-full transition-all duration-300 flex justify-center items-center gap-2 ${
                  selectedTicket 
                    ? 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 active:scale-95 cursor-pointer' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Ticket className="w-5 h-5" /> Comprar Bilhetes
              </button>

              <p className="text-[10px] text-gray-400 text-center mt-6 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Pagamento 100% Seguro
              </p>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}