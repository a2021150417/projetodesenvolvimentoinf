import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Ticket, Camera, History, Heart, Calendar, Settings, ChevronLeft, ShieldCheck } from "lucide-react";
import { useFavorites } from "./FavoritesContext";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}


export default function Perfil() {
  const navigate = useNavigate();
  const user = useMemo(() => getUserFromToken(), []);
  const userName = localStorage.getItem("userName") || "Utilizador";
  const { favorites } = useFavorites();
  const fileInputRef = useRef(null);

  const [nome, setNome] = useState(userName);
  const [email, setEmail] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem("userFoto") || null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [stats, setStats] = useState({ eventos_assistidos: 0, favoritos_guardados: 0, membro_desde: new Date().getFullYear() });
  const [eventosDetalhes, setEventosDetalhes] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) { navigate("/login"); return; }
    
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${user.id}`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${user.id}/stats`).then(r => r.json())
    ])
    .then(([dados, statsData]) => {
      setNome(dados.nome || "");
      setEmail(dados.email || "");
      if (dados.foto_perfil) {
        setFotoPerfil(dados.foto_perfil);
        localStorage.setItem("userFoto", dados.foto_perfil);
      }
      if (dados.is_admin) setIsAdmin(true);
      setStats(statsData);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, [user, navigate]);

  useEffect(() => {
    if (favorites.size === 0) return;
    favorites.forEach((eventId) => {
      if (!eventosDetalhes[eventId]) {
        fetch(`${import.meta.env.VITE_API_URL}/api/eventos/${eventId}`)
          .then(r => r.json())
          .then(dados => {
            setEventosDetalhes(prev => ({ ...prev, [eventId]: dados }));
          })
          .catch(() => {});
      }
    });
  }, [favorites]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userFoto");
    navigate("/");
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setMensagem("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email }),
      });
      
      if (res.ok) {
        localStorage.setItem("userName", nome);
        setMensagem("✅ Perfil atualizado!");
        setTimeout(() => setMensagem(""), 3000);
      } else {
        setMensagem("❌ Ocorreu um erro ao guardar.");
      }
    } catch {
      setMensagem("❌ Não foi possível ligar ao servidor.");
    } finally {
      setGuardando(false);
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadando(true);
    setMensagem("");

    try {
      const formData = new FormData();
      formData.append("foto", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${user.id}/foto`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const dados = await res.json();
        setFotoPerfil(dados.foto_perfil);
        localStorage.setItem("userFoto", dados.foto_perfil);
        setMensagem("✅ Foto de perfil atualizada!");
        setTimeout(() => setMensagem(""), 3000);
      } else {
        setMensagem("❌ Erro ao carregar a foto.");
      }
    } catch {
      setMensagem("❌ Não foi possível ligar ao servidor.");
    } finally {
      setUploadando(false);
    }
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
            <div className="flex items-center gap-2">
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="Perfil" className="w-8 h-8 rounded-full object-cover border-2 border-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-white/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-white font-bold">{userName}</span>
            </div>
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
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold bg-slate-50 text-black rounded-2xl border border-gray-200">
                <Settings className="w-4 h-4" /> Definições de Conta
              </button>
              <button onClick={() => navigate("/historico")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-slate-50 hover:text-black rounded-2xl transition-colors">
                <History className="w-4 h-4" /> Histórico de Compras
              </button>
              <button onClick={() => navigate("/bilhetes-ativos")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-slate-50 hover:text-black rounded-2xl transition-colors">
                <Ticket className="w-4 h-4" /> Os Meus Bilhetes
              </button>
              {isAdmin && (
                <button onClick={() => navigate("/admin")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors border border-indigo-100">
                  <ShieldCheck className="w-4 h-4" /> Painel Admin
                </button>
              )}
            </nav>
          </div>

          <button onClick={handleLogout} className="w-full px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-bold rounded-2xl transition-colors border border-transparent hover:border-red-100 flex items-center justify-center gap-2">
            Terminar Sessão
          </button>
        </aside>

        <main className="flex-1 space-y-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">O Meu Perfil</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                <Ticket className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-gray-900">{stats.eventos_assistidos}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Eventos Assistidos</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-gray-900">{stats.membro_desde}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Membro desde</p>
            </div>
          </div>

          {favorites.size > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Os Meus Favoritos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(favorites).map((eventId) => {
                  const evento = eventosDetalhes[eventId];
                  return (
                    <Link
                      key={eventId}
                      to={`/eventos/${eventId}`}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:shadow-black/5 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
                    >
                      <div className="relative h-40 overflow-hidden bg-gray-200">
                        {evento?.foto_evento ? (
                          <img src={evento.foto_evento} alt={evento.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-110 transition-transform duration-700" />
                        )}
                        <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 flex items-center justify-center shadow-lg">
                          <Heart className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        {evento?.data_hora && (
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                            {new Date(evento.data_hora).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                          </p>
                        )}
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600">
                          {evento?.titulo || `Evento #${eventId}`}
                        </h3>
                        {evento?.morada && (
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">📍 {evento.morada}</p>
                        )}
                        {evento?.preco && (
                          <p className="text-sm font-bold text-indigo-600 mt-auto">{evento.preco}€</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : (
              <div className="max-w-2xl">
                
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-8 border-b border-gray-100">
                  <div className="relative group">
                    {fotoPerfil ? (
                      <img src={fotoPerfil} alt="Perfil" className="w-24 h-24 rounded-full object-cover shadow-inner border border-gray-100" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border border-gray-200 shadow-inner">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current.click()}
                      disabled={uploadando}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {uploadando ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">Fotografia de Perfil</h3>
                    <p className="text-sm text-gray-500 mb-2">Recomendamos uma imagem quadrada. Máx: 2MB.</p>
                    <button onClick={() => fileInputRef.current.click()} className="text-sm font-bold text-black hover:underline underline-offset-2">
                      Carregar nova imagem
                    </button>
                  </div>
                </div>

                {mensagem && (
                  <div className={`mb-8 p-4 rounded-xl text-sm font-bold border flex items-center gap-2 ${mensagem.includes("✅") ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                    {mensagem}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Nome Completo</label>
                    <input 
                      type="text" 
                      value={nome} 
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full p-4 text-sm text-gray-900 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-inner" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Endereço de Email</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 text-sm text-gray-900 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-inner" 
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> Dados Seguros
                    </p>
                    <button 
                      onClick={handleGuardar} 
                      disabled={guardando}
                      className="w-full sm:w-auto px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 disabled:opacity-70 transition-all shadow-lg shadow-black/10 active:scale-95"
                    >
                      {guardando ? "A guardar..." : "Guardar Alterações"}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}