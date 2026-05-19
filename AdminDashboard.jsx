import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShieldCheck, CalendarPlus, Edit, Trash2, Users, LayoutDashboard, 
  MapPin, Calendar as CalendarIcon, Search, ChevronLeft, MoreVertical,
  TrendingUp, DollarSign, Activity, TicketCheck, UserCheck, QrCode, X
} from "lucide-react";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUserFromToken();
  const userName = localStorage.getItem("userName") || "Admin";
  
  // O NOVO ESTADO: O Dashboard começa trancado até falar com a Base de Dados
  const [verificandoAdmin, setVerificandoAdmin] = useState(true);
  
  const [tabAtiva, setTabAtiva] = useState("visao_geral"); 
  const [eventos, setEventos] = useState([]);
  const [utilizadores, setUtilizadores] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [adminStats, setAdminStats] = useState({ bilhetes_vendidos: 0, receita_total: 0 });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [eventoEditado, setEventoEditado] = useState(null); 
  const [novoEvento, setNovoEvento] = useState({
    titulo: "", preco: "", categoria: "", data_hora: "", local_evento: "", distrito: "", stock_disponivel: "", foto_evento: "", descricao: ""
  });

  const carregarEventos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/eventos`);
      if (res.ok) {
        const dados = await res.json();
        setEventos(dados.map(e => ({
          id: e.id_evento,
          title: e.titulo,
          image: e.foto_evento,
          price: Number(e.preco),
          category: e.categoria,
          district: e.distrito,
          date: e.data_hora,
          ticketsLeft: e.stock_disponivel,
          total: e.stock_disponivel,
          local_evento: e.local_evento,
          descricao: e.descricao
        })));
      }
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    }
  };

  const carregarUtilizadores = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores`);
      if (res.ok) {
        const dados = await res.json();
        setUtilizadores(dados);
      }
    } catch (error) {
      console.error("Erro ao buscar utilizadores:", error);
    }
  };

  const carregarAdminStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/admin/stats?t=${Date.now()}`);
      if (res.ok) {
        const dados = await res.json();
        setAdminStats(dados);
      }
    } catch (err) {
      console.error("Erro ao carregar stats admin:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 1. Se não tiver sessão, rua.
    if (!user) { 
      navigate("/login"); 
      return; 
    }
    
    // 2. O DASHBOARD PERGUNTA DIRETAMENTE À BD SE ÉS ADMIN
    fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${user.id}`)
      .then(r => r.json())
      .then(dados => {
        const isReallyAdmin = dados.is_admin === true || String(dados.is_admin) === "1" || String(dados.is_admin) === "true";
        
        if (isReallyAdmin) {
          // É o chefe! Vamos gravar o crachá e abrir a porta.
          localStorage.setItem("isAdmin", "true");
          setVerificandoAdmin(false); // Levanta a barreira!
          
          carregarEventos();
          carregarUtilizadores();
          carregarAdminStats();
        } else {
          // Falso admin detetado. Limpa crachás falsos e manda para a Home.
          localStorage.removeItem("isAdmin");
          navigate("/"); 
        }
      })
      .catch(() => {
        navigate("/"); // Se der erro de rede, manda para a Home por segurança
      });
      
  }, [navigate]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userFoto");
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const formatarDataParaInput = (dataIso) => {
    if (!dataIso) return "";
    const d = new Date(dataIso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    setNovoEvento({ ...novoEvento, [e.target.name]: e.target.value });
  };

  const abrirModalCriar = () => {
    setEventoEditado(null);
    setNovoEvento({ titulo: "", preco: "", categoria: "", data_hora: "", local_evento: "", distrito: "", stock_disponivel: "", foto_evento: "", descricao: "" });
    setMostrarModal(true);
  };

  const abrirModalEditar = (evento) => {
    setEventoEditado(evento.id);
    setNovoEvento({
      titulo: evento.title || "",
      preco: evento.price || "",
      categoria: evento.category || "",
      data_hora: formatarDataParaInput(evento.date),
      local_evento: evento.local_evento || "",
      distrito: evento.district || "",
      stock_disponivel: evento.total || "",
      foto_evento: evento.image || "",
      descricao: evento.descricao || ""
    });
    setMostrarModal(true);
  };

  const handleGuardarEvento = async (e) => {
    e.preventDefault(); 
    try {
      const url = eventoEditado 
        ? `${import.meta.env.VITE_API_URL}/api/eventos/${eventoEditado}` 
        : `${import.meta.env.VITE_API_URL}/api/eventos`;
      
      const metodo = eventoEditado ? "PUT" : "POST";

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoEvento)
      });
      
      if (res.ok) {
        carregarEventos();
        setMostrarModal(false); 
      } else {
        alert("Erro ao gravar o evento na base de dados.");
      }
    } catch (error) {
      alert("Não foi possível ligar ao servidor.");
    }
  };

  const handleEliminarEvento = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar este evento? Esta ação é irreversível.")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/eventos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEventos(eventos.filter(e => e.id !== id));
        carregarAdminStats(); 
      } else {
        alert("Erro ao tentar eliminar o evento.");
      }
    } catch (error) { 
      alert("Erro ao ligar ao servidor."); 
    }
  };

  const handleEliminarUtilizador = async (id_utilizador) => {
    if (!window.confirm("Tens a certeza absoluta que queres eliminar esta conta?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${id_utilizador}`, { method: "DELETE" });
      if (res.ok) {
        setUtilizadores(utilizadores.filter(u => u.id_utilizador !== id_utilizador));
        carregarAdminStats(); 
      }
    } catch (error) { alert("Não foi possível ligar ao servidor."); }
  };

  const eventosFiltrados = eventos.filter(evento => 
    evento.title.toLowerCase().includes(pesquisa.toLowerCase()) || 
    evento.district.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const utilizadoresFiltrados = utilizadores.filter(u => 
    (u.nome && u.nome.toLowerCase().includes(pesquisa.toLowerCase())) || 
    (u.email && u.email.toLowerCase().includes(pesquisa.toLowerCase()))
  );

  const getButtonClass = (nomeTab) => {
    const isActive = tabAtiva === nomeTab;
    return `w-full flex items-center gap-3 px-4 py-3 text-sm rounded-2xl transition-colors ${
      isActive ? "font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm" : "font-semibold text-gray-500 hover:bg-slate-50 hover:text-black border border-transparent"
    }`;
  };

  // ==========================================
  // BARREIRA DE VISUALIZAÇÃO
  // Devolve um ecrã vazio (mas da cor do site) 
  // enquanto não tem a certeza se és admin.
  // ==========================================
  if (verificandoAdmin) {
    return <div className="min-h-screen bg-slate-50"></div>; 
  }

  return (
    <div className="bg-slate-50 font-sans min-h-screen pb-20">
      
      <nav className="w-full z-40 bg-indigo-950 text-white flex justify-between items-center px-8 py-4 shadow-sm sticky top-0 border-b border-indigo-900">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="bg-white text-indigo-950 p-1 rounded text-sm">QP</span> QuickPass
          </Link>
          <span className="bg-indigo-500/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/50 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Modo Admin
          </span>
        </div>
        <div className="flex items-center gap-4 pl-4">
          <span className="text-white font-bold">{userName}</span>
          <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest border border-red-400/30 px-3 py-1.5 rounded-full hover:bg-red-400/10">
            Sair
          </button>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto w-full flex-grow flex flex-col md:flex-row gap-8 px-4 sm:px-8 py-10">
        
        <aside className="w-full md:w-64 flex-shrink-0 space-y-2 sticky top-28 h-fit">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-bold text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Voltar ao Site Normal
          </Link>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6">
            <nav className="space-y-1">
              <button onClick={() => { setTabAtiva("visao_geral"); setPesquisa(""); }} className={getButtonClass("visao_geral")}>
                <LayoutDashboard className="w-4 h-4" /> Visão Geral
              </button>
              <button onClick={() => { setTabAtiva("eventos"); setPesquisa(""); }} className={getButtonClass("eventos")}>
                <CalendarIcon className="w-4 h-4" /> Gestão de Eventos
              </button>
              <button onClick={() => { setTabAtiva("utilizadores"); setPesquisa(""); }} className={getButtonClass("utilizadores")}>
                <Users className="w-4 h-4" /> Utilizadores
              </button>
              <button onClick={() => navigate("/leitor-qr")} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-colors border border-emerald-100 mt-2">
                <QrCode className="w-4 h-4" /> Ler Bilhete QR
              </button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-8 min-w-0">
          
          {tabAtiva === "visao_geral" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Visão Geral</h1>
                <p className="text-gray-500 text-sm mt-1">Bem-vindo ao centro de controlo do QuickPass.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6" />
                  </div>
                 <div>
  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Receita Total</p>
  <p className="text-2xl font-black text-gray-900 mt-0.5">
    {adminStats.receita_total.toLocaleString("pt-PT", { 
      style: "currency", 
      currency: "EUR" 
    })}
  </p>
</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <TicketCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Bilhetes Vendidos</p>
                    <p className="text-2xl font-black text-gray-900 mt-0.5">{adminStats.bilhetes_vendidos}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Eventos Ativos</p>
                    <p className="text-2xl font-black text-gray-900 mt-0.5">{eventos.length}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Utilizadores</p>
                    <p className="text-2xl font-black text-gray-900 mt-0.5">{utilizadores.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Atividade Recente
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 py-3 border-b border-gray-50">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-sm font-medium text-gray-900 flex-1">Acesso ao painel de administração registado.</p>
                    <span className="text-xs text-gray-400">Agora</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tabAtiva === "eventos" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestão de Eventos</h1>
                  <p className="text-gray-500 text-sm mt-1">Cria, edita e apaga os eventos da plataforma.</p>
                </div>
                <button onClick={abrirModalCriar} className="flex items-center gap-2 px-6 py-3.5 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition shadow-lg shadow-black/10 active:scale-95 text-sm">
                  <CalendarPlus className="w-4 h-4" /> Novo Evento
                </button>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-3" />
                <input type="text" placeholder="Pesquisar evento..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="w-full pl-3 pr-4 py-1.5 bg-transparent text-sm focus:outline-none text-gray-900 font-medium" />
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Evento</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Data & Local</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Bilhetes</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {eventosFiltrados.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm font-medium">Nenhum evento encontrado.</td></tr>
                      ) : (
                        eventosFiltrados.map((evento) => {
                          const percentagemVendida = Math.round(((evento.total - evento.ticketsLeft) / evento.total) * 100) || 0;
                          return (
                            <tr key={evento.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <img src={evento.image || "https://via.placeholder.com/150"} alt={evento.title} className="w-12 h-12 rounded-xl object-cover border border-gray-200" />
                                  <div>
                                    <p className="font-bold text-gray-900 text-sm">{evento.title}</p>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">{evento.price}€ • {evento.category}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold text-gray-900 flex items-center gap-1.5"><CalendarIcon className="w-3.5 h-3.5 text-gray-400" /> {evento.date ? new Date(evento.date).toLocaleDateString('pt-PT') : 'ND'}</p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {evento.district}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1.5 w-32">
                                  <div className="flex justify-between text-xs font-bold">
                                    <span className="text-gray-900">{evento.total - evento.ticketsLeft}</span>
                                    <span className={evento.ticketsLeft < 50 ? "text-red-500" : "text-emerald-500"}>{evento.ticketsLeft} left</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${percentagemVendida > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${percentagemVendida}%` }}></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => abrirModalEditar(evento)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleEliminarEvento(evento.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {tabAtiva === "utilizadores" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Utilizadores</h1>
                  <p className="text-gray-500 text-sm mt-1">Gere as contas e as permissões de quem usa a plataforma.</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <Search className="w-5 h-5 text-gray-400 ml-3" />
                <input type="text" placeholder="Pesquisar por nome ou email..." value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} className="w-full pl-3 pr-4 py-1.5 bg-transparent text-sm focus:outline-none text-gray-900 font-medium" />
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Utilizador</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Cargo</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {utilizadoresFiltrados.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm font-medium">Nenhum utilizador encontrado.</td></tr>
                      ) : (
                        utilizadoresFiltrados.map((u) => (
                          <tr key={u.id_utilizador} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm">
                                  {u.nome ? u.nome.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm">{u.nome || "Sem Nome"}</p>
                                  <p className="text-xs text-gray-500">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {u.is_admin ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-widest">
                                  <ShieldCheck className="w-3 h-3" /> Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-widest">
                                  <UserCheck className="w-3 h-3" /> Normal
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Ativo
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {!u.is_admin && (
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleEliminarUtilizador(u.id_utilizador)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar Conta">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-indigo-950/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <CalendarPlus className="w-6 h-6 text-indigo-600" /> 
                {eventoEditado ? "Editar Evento" : "Criar Novo Evento"}
              </h2>
              <button onClick={() => setMostrarModal(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGuardarEvento} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Título do Evento *</label>
                <input type="text" name="titulo" required value={novoEvento.titulo} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Categoria *</label>
                  <input type="text" name="categoria" required value={novoEvento.categoria} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Data e Hora *</label>
                  <input type="datetime-local" name="data_hora" required value={novoEvento.data_hora} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Preço (€) *</label>
                  <input type="number" step="0.01" name="preco" required value={novoEvento.preco} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Stock Disponível *</label>
                  <input type="number" name="stock_disponivel" required value={novoEvento.stock_disponivel} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Local (Recinto) *</label>
                  <input type="text" name="local_evento" required value={novoEvento.local_evento} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Distrito *</label>
                  <input type="text" name="distrito" required value={novoEvento.distrito} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição do Evento *</label>
                <textarea name="descricao" required rows="3" value={novoEvento.descricao} onChange={handleChange} placeholder="Escreve aqui todos os detalhes fantásticos do teu evento..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">URL da Imagem (Opcional)</label>
                <input type="text" name="foto_evento" value={novoEvento.foto_evento} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setMostrarModal(false)} className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2.5 text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition-colors shadow-md shadow-indigo-600/20">
                  {eventoEditado ? "Atualizar Evento" : "Guardar Evento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}