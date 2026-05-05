import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Ticket, Camera, History, Heart, Calendar, Settings, ChevronLeft, ShieldCheck } from "lucide-react";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}

export default function Perfil() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const userName = localStorage.getItem("userName") || "Utilizador";
  const fileInputRef = useRef(null);

  const [nome, setNome] = useState(userName);
  const [email, setEmail] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(localStorage.getItem("userFoto") || null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) { navigate("/login"); return; }
    
    fetch(`http://localhost:3001/api/utilizadores/${user.id}`)
      .then((r) => r.json())
      .then((dados) => {
        setNome(dados.nome || "");
        setEmail(dados.email || "");
        if (dados.foto_perfil) {
          setFotoPerfil(dados.foto_perfil);
          localStorage.setItem("userFoto", dados.foto_perfil);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, navigate]);

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
      const res = await fetch(`http://localhost:3001/api/utilizadores/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nome, 
          email, 
          foto_perfil: fotoPerfil 
        }), 
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

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadando(true);
    
    // Transforma a imagem num formato de texto (Base64) para guardar na BD
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      setTimeout(() => {
        setFotoPerfil(base64String);
        localStorage.setItem("userFoto", base64String);
        setUploadando(false);
        setMensagem("✅ Foto adicionada! Clica em 'Guardar Alteraçóes' para gravar.");
        setTimeout(() => setMensagem(""), 4000);
      }, 800);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      
      {/* NAVBAR SUPERIOR */}
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
        
        {/* SIDEBAR LATERAL */}
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
            </nav>
          </div>

          <button onClick={handleLogout} className="w-full px-4 py-3 text-red-500 hover:bg-red-50 text-sm font-bold rounded-2xl transition-colors border border-transparent hover:border-red-100 flex items-center justify-center gap-2">
            Terminar Sessão
          </button>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 space-y-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">O Meu Perfil</h1>

          {/* DASHBOARD DE ESTATÍSTICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                <Ticket className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-gray-900">12</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Eventos Assistidos</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-gray-900">4</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Favoritos Guardados</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-3xl font-black text-gray-900">2026</p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Membro desde</p>
            </div>
          </div>

          {/* FORMULÁRIO DE EDIÇÃO */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
              </div>
            ) : (
              <div className="max-w-2xl">
                
                {/* ZONA DA FOTOGRAFIA */}
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

                {/* ZONA DOS DADOS */}
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