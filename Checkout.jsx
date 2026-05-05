import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, ChevronRight, ShieldCheck, CreditCard,
  Mail, Phone, User as UserIcon, Lock, CheckCircle2,
  Calendar, MapPin, Ticket, Loader2,
} from "lucide-react";
import Navbar from "./Navbar";
import { useCart } from "./CartContext";

function formatDateLong(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
}

// Componente QR Code simples gerado via API pública (sem dependências)
function QRCodeImage({ value, size = 140 }) {
  const encoded = encodeURIComponent(value);
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&bgcolor=ffffff&color=000000&margin=8`}
      alt="QR Code do bilhete"
      className="rounded-xl shadow-md"
      width={size}
      height={size}
    />
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({
    nome: "", email: "", telefone: "",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
  });

  // Estados do pagamento
  const [step, setStep] = useState("form"); // "form" | "processing" | "success" | "error"
  const [processingMsg, setProcessingMsg] = useState("");
  const [bilhetesComprados, setBilhetesComprados] = useState([]);
  const [erroMsg, setErroMsg] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (cart.length === 0 && step === "form") navigate("/carrinho");
  }, [cart, step, navigate]);

  const serviceFee = cart.length > 0 ? 2.5 : 0;
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price), 0);
  const total = subtotal + serviceFee;

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const formatCardNumber = (v) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return digits.slice(0, 2) + "/" + digits.slice(2);
  };

  // Obter utilizador do JWT no localStorage
  const getUtilizador = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload; // { id, email }
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep("processing");

    const utilizador = getUtilizador();
    if (!utilizador) {
      setErroMsg("Precisas de estar autenticado para comprar bilhetes.");
      setStep("error");
      return;
    }

    // Simular processamento de pagamento (1.5s)
    setProcessingMsg("A verificar dados do cartão...");
    await new Promise((r) => setTimeout(r, 800));
    setProcessingMsg("A processar pagamento...");
    await new Promise((r) => setTimeout(r, 900));
    setProcessingMsg("A gerar os teus bilhetes...");
    await new Promise((r) => setTimeout(r, 600));

    // Para cada item no carrinho, criar bilhete na BD
    const resultados = [];
    for (const item of cart) {
      try {
        const res = await fetch("http://localhost:3001/api/bilhetes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            id_utilizador: utilizador.id,
            id_evento: item.eventId,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.erro || "Erro ao criar bilhete");
        }

        const bilhete = await res.json();
        resultados.push({ ...bilhete, item });
      } catch (err) {
        setErroMsg(`Erro ao comprar bilhete para "${item.eventTitle}": ${err.message}`);
        setStep("error");
        return;
      }
    }

    setBilhetesComprados(resultados);
    clearCart();
    setStep("success");
  };

  // ── ECRÃ: A PROCESSAR ──
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">A processar o teu pagamento</h2>
              <p className="text-gray-500 text-sm">{processingMsg}</p>
            </div>
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── ECRÃ: ERRO ──
  if (step === "error") {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">✕</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pagamento falhado</h2>
            <p className="text-gray-500 text-sm mb-6">{erroMsg}</p>
            <button
              onClick={() => setStep("form")}
              className="w-full bg-gray-900 text-white font-semibold py-3 rounded-full hover:bg-gray-700 transition-all"
            >
              Tentar novamente
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── ECRÃ: SUCESSO ──
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 py-12">
          <div className="max-w-lg mx-auto">
            {/* Header sucesso */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl px-6 py-10 text-center text-white mb-6 shadow-xl shadow-emerald-200">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Compra concluída!</h2>
              <p className="text-white/90 text-sm">
                Os teus bilhetes foram gerados e guardados no teu perfil.
              </p>
            </div>

            {/* Bilhetes com QR */}
            <div className="space-y-4 mb-6">
              {bilhetesComprados.map((b, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Cabeçalho do bilhete */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <Ticket className="w-4 h-4" />
                      <span className="font-bold text-sm">{b.item.ticketType || "Bilhete Geral"}</span>
                    </div>
                    <span className="text-white/80 text-xs font-mono">#{b.id_bilhete}</span>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5 flex gap-4 items-center">
                    <div className="flex-shrink-0">
                      <QRCodeImage value={b.codigo_qr} size={120} />
                      <p className="text-[10px] text-gray-400 text-center mt-1 font-mono">{b.codigo_qr.slice(0, 20)}...</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">{b.item.eventTitle}</h3>
                      {b.item.eventDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateLong(b.item.eventDate)}
                        </div>
                      )}
                      {b.item.eventLocation && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          {b.item.eventLocation}
                        </div>
                      )}
                      <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
                        ✓ Válido
                      </div>
                    </div>
                  </div>

                  {/* Separador perfurado */}
                  <div className="flex items-center px-4">
                    <div className="w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -ml-6" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-100 mx-2" />
                    <div className="w-4 h-4 rounded-full bg-gray-50 border border-gray-100 -mr-6" />
                  </div>

                  <div className="px-5 py-3 flex justify-between items-center text-sm">
                    <span className="text-gray-500">Preço pago</span>
                    <span className="font-bold text-gray-900">{Number(b.item.price).toFixed(2)}€</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>Taxa de serviço</span>
                <span>{serviceFee.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-3">
                <span>Total pago</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/perfil")}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 rounded-full hover:bg-indigo-700 transition-all text-sm"
              >
                <UserIcon className="w-4 h-4" /> Ver perfil
              </button>
              <button
                onClick={() => navigate("/eventos")}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-200 transition-all text-sm"
              >
                Mais eventos
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── ECRÃ: FORMULÁRIO ──
  return (
    <div className="min-h-screen bg-gray-50 font-sans pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
          <Link to="/eventos" className="hover:text-gray-900">Eventos</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/carrinho" className="hover:text-gray-900">Carrinho</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Esquerda */}
          <div className="space-y-6">
            {/* Dados pessoais */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Dados pessoais</h2>
                  <p className="text-xs text-gray-500">Vamos enviar os bilhetes para o teu email</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Nome completo</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="text" value={form.nome} onChange={handleChange("nome")} placeholder="João Silva"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="email" value={form.email} onChange={handleChange("email")} placeholder="joao@email.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="tel" value={form.telefone} onChange={handleChange("telefone")} placeholder="+351 912 345 678"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>
              </div>
            </section>

            {/* Pagamento */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">Método de pagamento</h2>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Pagamento encriptado e seguro
                  </p>
                </div>
              </div>

              {/* Card preview */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 mb-5 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-4" />
                <div className="text-xs text-white/60 mb-4 font-mono uppercase tracking-widest">QuickPass Card</div>
                <div className="font-mono text-lg tracking-widest mb-4">
                  {form.cardNumber || "•••• •••• •••• ••••"}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-white/60 uppercase mb-0.5">Titular</div>
                    <div className="text-sm font-medium uppercase">{form.cardName || "NOME NO CARTÃO"}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/60 uppercase mb-0.5">Validade</div>
                    <div className="text-sm font-mono">{form.expiry || "MM/AA"}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Número do cartão</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input required type="text" value={form.cardNumber}
                      onChange={(e) => setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Nome no cartão</label>
                  <input required type="text" value={form.cardName} onChange={handleChange("cardName")} placeholder="JOÃO SILVA"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Validade</label>
                    <input required type="text" value={form.expiry}
                      onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/AA"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">CVV</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input required type="text" maxLength={3} value={form.cvv}
                        onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        placeholder="123"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Direita — resumo */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white">
                <h3 className="font-bold">Resumo da Compra</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      {item.eventImage ? (
                        <img src={item.eventImage} alt={item.eventTitle} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <Ticket className="w-6 h-6 text-indigo-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 line-clamp-2">{item.eventTitle}</div>
                        {item.eventDate && (
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{formatDateLong(item.eventDate)}
                          </div>
                        )}
                        <div className="text-xs text-indigo-600 font-medium mt-0.5">{item.ticketType}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-900 flex-shrink-0">{Number(item.price).toFixed(2)}€</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} {cart.length === 1 ? "bilhete" : "bilhetes"})</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxa de serviço</span>
                    <span>{serviceFee.toFixed(2)}€</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-gray-900">{total.toFixed(2)}€</span>
                </div>

                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-full hover:shadow-lg hover:scale-[1.02] transition-all">
                  Pagar {total.toFixed(2)}€ <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Pagamento seguro · SSL encriptado</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}