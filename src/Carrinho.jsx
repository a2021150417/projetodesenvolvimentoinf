import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, Ticket, ShieldCheck, ArrowLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from './CartContext';
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Carrinho() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (cart) {
      const initializedCart = cart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
        // Caso o item ainda não tenha o campo vindo do passo 1, assume um fallback alto (ex: 99) para não quebrar
        ticketsLeft: item.ticketsLeft !== undefined ? item.ticketsLeft : 99
      }));
      setLocalCart(initializedCart);
    }
  }, [cart]);

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    
    const dataFormatada = d.toLocaleDateString("pt-PT", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
    
    const horaFormatada = d.toLocaleTimeString("pt-PT", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });

    return `${dataFormatada} às ${horaFormatada}`;
  }

  const subtotal = localCart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const taxaServico = localCart.length > 0 ? 2.50 : 0;
  const totalFinal = subtotal + taxaServico;

  // Lógica de alteração com validação de limite máximo de stock
  const handleQuantityChange = (index, adjustment) => {
    const updated = [...localCart];
    const newQty = updated[index].quantity + adjustment;
    const maxStock = updated[index].ticketsLeft;
    const itemId = updated[index].eventId || updated[index].id;

    if (newQty < 1) {
      removeFromCart(itemId);
    } else if (newQty <= maxStock) { // <--- VALIDAÇÃO: Só avança se for menor ou igual ao stock real
      updated[index].quantity = newQty;
      setLocalCart(updated);

      // Sincroniza com o Context via updateQuantity (se disponível) ou mutação direta
      if (updateQuantity) {
        updateQuantity(itemId, newQty);
      } else if (cart[index]) {
        cart[index].quantity = newQty;
      }
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-slate-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="max-w-screen-xl mx-auto px-8 py-12 w-full flex-grow z-10">

        <div className="flex flex-col gap-2 mb-8 pt-12 text-left">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-semibold text-sm transition-colors w-fit bg-transparent border-0 p-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mt-1">
            <Link to="/eventos" className="hover:text-black transition-colors">Eventos</Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-bold text-gray-900">Carrinho</span>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">O teu carrinho</h1>

        {localCart.length === 0 ? (
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
              {localCart.map((item, index) => {
                const isMaxStock = item.quantity >= item.ticketsLeft;
                return (
                  <div key={item.eventId || item.id || index} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:border-gray-300 transition-colors">
                    <img src={item.eventImage} alt={item.eventTitle} className="w-full sm:w-32 h-32 object-cover rounded-2xl shadow-inner"/>

                    <div className="flex-grow text-center sm:text-left w-full">
                      <p className="text-xs text-gray-400 font-semibold mb-1">{formatDate(item.eventDate || item.date)}</p>

                      <Link to={`/eventos/${item.eventId || item.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-500 hover:underline transition-colors cursor-pointer">
                          {item.eventTitle}
                        </h3>
                      </Link>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-2">
                        <div className="inline-block bg-slate-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold">
                          {item.ticketType}
                        </div>

                        <div className="flex items-center border border-gray-200 rounded-xl bg-slate-50 p-1">
                          <button
                            onClick={() => handleQuantityChange(index, -1)}
                            className="p-1 rounded-lg text-gray-500 hover:bg-white hover:text-black transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="px-3 text-sm font-bold text-gray-900 min-w-[24px] text-center">
                            {item.quantity}
                          </span>

                          {/* O botão + ganha opacidade reduzida e muda o cursor se atingir o limite máximo */}
                          <button
                            onClick={() => handleQuantityChange(index, 1)}
                            disabled={isMaxStock}
                            className={`p-1 rounded-lg text-gray-500 transition-colors ${isMaxStock ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:text-black cursor-pointer'}`}
                            title={isMaxStock ? "Quantidade máxima atingida de acordo com o stock" : "Adicionar mais"}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Alerta estético caso o stock do evento esteja abaixo de 10 unidades e chegue ao limite */}
                        {isMaxStock && item.ticketsLeft <= 10 && (
                          <span className="text-[11px] text-red-500 font-bold animate-pulse">
                            Apenas restam {item.ticketsLeft} bilhetes em stock!
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col justify-between items-center w-full sm:w-auto h-full gap-4">
                      <p className="text-2xl font-black text-gray-900">{(item.price * item.quantity).toFixed(2)}€</p>
                      <button onClick={() => removeFromCart(item.eventId || item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 cursor-pointer" title="Remover bilhete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="bg-white rounded-[2rem] border border-gray-200 shadow-xl p-8 sticky top-32">
                <h3 className="font-bold text-xl text-gray-900 mb-6">Resumo da compra</h3>
                <div className="space-y-4 mb-6 text-sm font-medium text-gray-600 border-b border-gray-100 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({localCart.reduce((acc, item) => acc + item.quantity, 0)} {localCart.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'bilhete' : 'bilhetes'})</span>
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
                <button
                  onClick={() => {
                    // Sincroniza as quantidades do estado local de volta para o array global do Context
                    localCart.forEach((item, index) => {
                      if (updateQuantity) {
                        updateQuantity(item.eventId || item.id, item.quantity);
                      } else if (cart[index]) {
                        cart[index].quantity = item.quantity;
                      }
                    });

                    // Se o teu projeto usa localStorage para persistir o carrinho, guarda-o também:
                    localStorage.setItem("cart", JSON.stringify(cart));

                    // Avança para o checkout com os dados atualizados
                    navigate("/checkout");
                  }}
                  className="w-full bg-black text-white font-bold text-lg py-4 rounded-full hover:bg-green-500 transition-all duration-300 shadow-lg shadow-black/10 flex justify-center items-center gap-2 active:scale-95 cursor-pointer"
                >
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
      <Footer />
    </div>
  );
}