import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Ticket, History, Settings, ChevronLeft, ShoppingBag, Calendar, Search } from "lucide-react";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}

const getEstadoBadge = (estado) => {
  switch (estado) {
    case "ativo": return "bg-green-100 text-green-700";
    case "usado": return "bg-gray-100 text-gray-600";
    case "cancelado": return "bg-red-100 text-red-600";
    default: return "bg-green-100 text-green-700";
  }
};

export default function HistoricoCompras() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const userName = localStorage.getItem("userName") || "Utilizador";
  const fotoPerfil = localStorage.getItem("userFoto") || null;

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) { navigate("/login"); return; }
    fetch(`http://localhost:3001/api/bilhetes/utilizador/${user.id}`)
      .then((r) => r.json())
      .then((dados) => {
        setCompras(Array.isArray(dados) ? dados : []);
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

  const comprasFiltradas = compras.filter((c) =>
    (c.titulo_evento || "").toLowerCase().includes(pesquisa.toLowerCase()) ||
    (c.codigo_qr || "").toLowerCase().includes(pesquisa.toLowerCase())
  );

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
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold bg-slate-50 text-black rounded-2xl border border-gray-200">
                <History className="w-4 h-4" /> Histórico de Compras
              </button>
              <button onClick={() => navigate("/bilhetes-ativos")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-slate-50 hover:text-black rounded-2xl transition-colors">
                <Ticket className="w-4 h-4" /> Os Meus Bilhetes
              </button>
            </nav>
          </div>
          <button onClick={handleLogout} className="w-full px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-bold rounded-2xl transition-colors border border-transparent hover:border-red-100 flex items-center justify-center gap-2">
            Terminar Sessão
          </button>
        </aside>

        <main className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Histórico de Compras</h1>
            {compras.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  placeholder="Pesquisar..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : compras.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ainda não fizeste nenhuma compra</h3>
                <p className="text-gray-500 max-w-sm mb-8 text-sm">O teu histórico está vazio. Descobre os melhores eventos disponíveis e vive momentos inesquecíveis.</p>
                <button onClick={() => navigate("/eventos")} className="px-8 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition shadow-lg shadow-black/10 active:scale-95 text-sm">
                  Explorar Eventos
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-slate-50">
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Evento</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Compra</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Preço</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {comprasFiltradas.map((c) => (
                      <tr key={c.id_bilhete} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{c.titulo_evento || `Evento #${c.id_evento}`}</div>
                          <div className="text-xs text-gray-400 font-mono mt-0.5">{c.codigo_qr}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {c.data_compra
                              ? new Date(c.data_compra).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })
                              : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {c.preco ? `${c.preco}€` : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getEstadoBadge(c.estado_bilhete)}`}>
                            {c.estado_bilhete || "ativo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}