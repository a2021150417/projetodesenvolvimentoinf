import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Ticket, ShieldCheck, ChevronLeft, ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';

export default function Carrinho() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

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
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const taxaServico = cart.length > 0 ? 2.50 : 0; 
  const totalFinal = subtotal + taxaServico;

  return (
    <div className="font-sans text-gray-900 bg-slate-50 min-h-screen flex flex-col">
      
      {/* NAVBAR INTELIGENTE */}
      <nav className="w-full z-50 bg-gray-950 text-white flex justify-between items-center px-8 py-4 shadow-sm">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
        </Link>
        <div className="flex gap-5 items-center font-medium">
          <Link to="/eventos" className="text-gray-300 hover:text-white transition-colors">Eventos</Link>
          
          <div className="relative mr-4">
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-green-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cart.length}
              </span>
            )}
          </div>

          {/* Secção do Utilizador */}
          {token ? (
            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
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
            <div className="flex gap-5 items-center pl-4 border-l border-white/20">
              <Link to="/registo" className="text-gray-300 hover:text-white transition-colors">Registar</Link>
              <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition shadow-sm font-semibold">Entrar</Link>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto px-8 py-12 w-full flex-grow">
        <Link to="/eventos" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Continuar a comprar
        </Link>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">O teu carrinho</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Ticket className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">O teu carrinho está vazio</h2>
            <p className="text-gray-500 mb-8 max-w-md">Ainda não adicionaste nenhum bilhete. Descobre os melhores eventos e vive momentos inesquecíveis.</p>
            <Link to="/eventos" className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-green-500 transition-colors shadow-lg">
              Explorar Eventos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-gray-300 transition-colors">
                  <img src={item.eventImage} alt={item.eventTitle} className="w-full sm:w-32 h-32 object-cover rounded-2xl shadow-inner"/>
                  <div className="flex-grow text-center sm:text-left w-full">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{item.eventDate}</p>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.eventTitle}</h3>
                    <div className="inline-block bg-slate-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold mb-4">
                      {item.ticketType}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between items-center w-full sm:w-auto h-full gap-4">
                    <p className="text-2xl font-black text-gray-900">{item.price}€</p>
                    <button onClick={() => removeFromCart(index)} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="Remover bilhete">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl p-8 sticky top-32">
                <h3 className="font-bold text-xl text-gray-900 mb-6">Resumo da compra</h3>
                <div className="space-y-4 mb-6 text-sm font-medium text-gray-600 border-b border-gray-100 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cart.length} {cart.length === 1 ? 'bilhete' : 'bilhetes'})</span>
                    <span className="text-gray-900">{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de serviço</span>
                    <span className="text-gray-900">{taxaServico.toFixed(2)}€</span>
                  </div>
                </div>
                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-gray-900">Total a pagar</span>
                  <span className="text-4xl font-black text-gray-900">{totalFinal.toFixed(2)}€</span>
                </div>
                <button className="w-full bg-black text-white font-bold text-lg py-4 rounded-full hover:bg-green-500 transition-all duration-300 shadow-lg shadow-black/10 flex justify-center items-center gap-2 active:scale-95">
                  Finalizar Compra <ArrowRight className="w-5 h-5" />
                </button>
                <div className="mt-6 space-y-3">
                  <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4 text-green-500" /> Pagamento 100% Seguro
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}