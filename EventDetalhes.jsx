import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Ticket, Star, ChevronLeft, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';
import { useCart } from './CartContext';
import Navbar from "./Navbar";

function formatDateLong(iso) {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("pt-PT", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("pt-PT", { month: "long" });
  const year = d.getFullYear();
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${cap(weekday)}, ${day} de ${month} de ${year}`;
}

export default function EventDetalhes() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`http://localhost:3001/api/eventos/${id}`)
      .then((r) => r.json())
      .then((dados) => {
        const adapted = {
          id: dados.id_evento,
          title: dados.titulo,
          description: dados.descricao,
          shortDescription: dados.descricao_curta,
          date: dados.data_hora,
          price: parseFloat(dados.preco),
          image: dados.foto_evento,
          ticketsLeft: dados.stock_disponivel,
          doorsOpen: dados.hora_portas,
          startTime: dados.hora_inicio,
          venue: dados.local_evento,
          address: dados.morada,
          district: dados.distrito,
          category: dados.categoria,
          trending: dados.em_alta,
          rating: parseFloat(dados.classificacao),
          ticketTypes: [
            { id: 1, name: 'Bilhete Geral', description: 'Acesso normal ao evento', price: parseFloat(dados.preco) }
          ]
        };
        setEvent(adapted);
        setSelectedTicket(adapted.ticketTypes[0]);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
        <Navbar />
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mt-20" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
        <Navbar />
        <h1 className="text-3xl font-bold mb-4">Evento não encontrado</h1>
        <Link to="/eventos" className="text-green-500 hover:underline font-bold">← Voltar aos eventos</Link>
      </div>
    );
  }

  const handleBuyTicket = () => {
    if (!selectedTicket) return;
    addToCart({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventImage: event.image,
      ticketType: selectedTicket.name,
      price: selectedTicket.price,
      quantity: 1
    });
    navigate('/carrinho');
  };

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      <Navbar />

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
              <span className="px-4 py-1.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/10">Em Alta</span>
            )}
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-4 leading-[0.9]"
            style={{ color: '#ffffff', textShadow: '0 4px 12px rgba(0,0,0,0.9)' }}>
            {event.title}
          </h1>
          <p className="text-xl md:text-2xl font-semibold max-w-3xl opacity-95"
            style={{ color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
            {event.shortDescription}
          </p>
        </div>
      </section>

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

          <div>
            <div className="bg-white rounded-[2rem] border border-gray-200 shadow-2xl shadow-gray-200/50 p-8 sticky top-32">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">A partir de</p>
                  <p className="text-4xl font-black text-gray-900">{event.price}€</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm font-bold">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {event.rating}
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
                    <div key={ticket.id} onClick={() => setSelectedTicket(ticket)}
                      className={`group flex justify-between items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-black bg-white shadow-lg ring-4 ring-black/5' : 'border-transparent bg-slate-50 hover:bg-white hover:border-gray-200'}`}>
                      <div>
                        <p className={`font-bold ${isSelected ? 'text-black' : 'text-gray-900'}`}>{ticket.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium">{ticket.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-lg text-gray-900">{ticket.price}€</p>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-black bg-black' : 'border-gray-300 bg-white'}`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={handleBuyTicket} disabled={!selectedTicket}
                className={`w-full font-bold text-lg py-4 rounded-full transition-all duration-300 flex justify-center items-center gap-2 ${selectedTicket ? 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 active:scale-95 cursor-pointer' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}>
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