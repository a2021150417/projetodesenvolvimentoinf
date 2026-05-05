import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Ticket, History, Settings, ChevronLeft, QrCode, Calendar } from "lucide-react";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}

const getQrUrl = (texto) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(texto)}`;

export default function BilhetesAtivos() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const userName = localStorage.getItem("userName") || "Utilizador";
  const fotoPerfil = localStorage.getItem("userFoto") || null;

  const [bilhetes, setBilhetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrAberto, setQrAberto] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) { navigate("/login"); return; }
    fetch(`http://localhost:3001/api/bilhetes/utilizador/${user.id}`)
      .then((r) => r.json())
      .then((dados) => {
        const ativos = Array.isArray(dados)
          ? dados.filter((b) => !b.estado_bilhete || b.estado_bilhete === "ativo")
          : [];
        setBilhetes(ativos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userFoto");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <nav className="w-full z-50 bg-gray-950 text-white flex justify-between items-center px-8 py-4 shadow-sm sticky top-0">
        <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
        </Link>
        <div className="flex gap-5 items-center font-medium">
          <Link to="/eventos" className="text-gray-300 hover:text-white transition-colors">Eventos</Link>
          <div className="flex items-center gap-4 pl-4 border-l border-white/20">
            <Link to="/perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="Perfil" className="w-8 h-8 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-white/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-white font-bold">{userName}</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto w-full flex-grow flex flex-col md:flex-row gap-8 px-4 sm:px-8 py-10">
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Voltar à Home
          </Link>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6">
            <nav className="space-y-1">
              <button onClick={() => navigate("/perfil")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-slate-50 hover:text-black rounded-2xl transition-colors">
                <Settings className="w-4 h-4" /> Definições de Conta
              </button>
              <button onClick={() => navigate("/historico")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-slate-50 hover:text-black rounded-2xl transition-colors">
                <History className="w-4 h-4" /> Histórico de Compras
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold bg-slate-50 text-black rounded-2xl border border-gray-200">
                <Ticket className="w-4 h-4" /> Os Meus Bilhetes
              </button>
            </nav>
          </div>
          <button onClick={handleLogout} className="w-full px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-bold rounded-2xl transition-colors border border-transparent hover:border-red-100 flex items-center justify-center gap-2">
            Terminar Sessão
          </button>
        </aside>

        <main className="flex-1 space-y-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Os Meus Bilhetes</h1>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
          ) : bilhetes.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                <QrCode className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Não tens bilhetes ativos</h3>
              <p className="text-gray-500 max-w-sm mb-8 text-sm">Os bilhetes dos teus próximos eventos vão aparecer aqui com o QR Code pronto a usar.</p>
              <button onClick={() => navigate("/eventos")} className="px-8 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition shadow-lg shadow-black/10 active:scale-95 text-sm">
                Procurar Eventos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {bilhetes.map((b) => (
                <div key={b.id_bilhete} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row relative hover:shadow-md transition-shadow">
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-dashed border-gray-200">
                    <div>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-lg mb-4">✓ Ativo</span>
                      <h3 className="text-xl font-extrabold text-gray-900 leading-tight mb-2">
                        {b.titulo_evento || `Evento #${b.id_evento}`}
                      </h3>
                      {b.data_hora && (
                        <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mb-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(b.data_hora).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Titular</p>
                      <p className="text-sm font-bold text-gray-900">{userName}</p>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 w-full sm:w-48 bg-slate-50 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-white p-2 border border-gray-200 rounded-xl shadow-sm mb-3">
                      <img src={getQrUrl(b.codigo_qr)} alt="QR Code" className="w-full h-full" />
                    </div>
                    <p className="text-[10px] text-gray-500 font-semibold">#{b.id_bilhete}</p>
                    <button
                      onClick={() => setQrAberto(qrAberto === b.id_bilhete ? null : b.id_bilhete)}
                      className="mt-4 text-xs font-bold text-black hover:underline"
                    >
                      Ver em Grande
                    </button>
                  </div>
                  <div className="hidden sm:block absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2 border-r border-gray-100"></div>
                  <div className="hidden sm:block absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2 border-l border-gray-100"></div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {qrAberto && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={() => setQrAberto(null)}>
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 text-lg">O teu bilhete</h3>
            <img src={getQrUrl(bilhetes.find((b) => b.id_bilhete === qrAberto)?.codigo_qr)} alt="QR Code" className="w-52 h-52" />
            <p className="text-xs text-gray-400 font-mono text-center break-all">
              {bilhetes.find((b) => b.id_bilhete === qrAberto)?.codigo_qr}
            </p>
            <button onClick={() => setQrAberto(null)} className="px-6 py-2.5 bg-black text-white font-bold rounded-full text-sm">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}