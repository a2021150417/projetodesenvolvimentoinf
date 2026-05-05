import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search, Heart, MapPin, Calendar, Ticket, Flame, Sparkles, ChevronRight, X, SlidersHorizontal, Clock,
} from "lucide-react";
import { useFavorites } from "./FavoritesContext";
const CATEGORIES = ["Música", "Desporto", "Teatro", "Comédia"];
const DISTRICTS = ["Coimbra", "Porto", "Lisboa", "Leiria"];
const SORT_OPTIONS = [
  { id: "date-asc", label: "Data: ascendente" },
  { id: "date-desc", label: "Data: descendente" },
  { id: "price-asc", label: "Preço: baixo para alto" },
  { id: "price-desc", label: "Preço: alto para baixo" },
];
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "numeric", year: "2-digit" });
}
import Navbar from "./Navbar";

function EventCard({ event }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(event.id);
  const soldOutSoon = event.ticketsLeft < 50;
  const availability = Math.round((event.ticketsLeft / event.total) * 100);

  return (
    <article className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 flex flex-col cursor-pointer">
      <Link to={`/eventos/${event.id}`} className="block">
        <div className="relative overflow-hidden aspect-[16/10]">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {event.trending && <span className="flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-md"><Flame className="w-3 h-3" />Em alta</span>}
            {event.isNew && <span className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-md"><Sparkles className="w-3 h-3" />Novo</span>}
            {soldOutSoon && <span className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow-md animate-pulse">Últimos</span>}
          </div>
        </div>
      </Link>

      <button onClick={() => toggleFavorite(event.id)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-md z-10">
        <Heart className={`w-4 h-4 transition-all ${fav ? "fill-red-500 text-red-500 scale-110" : "text-gray-900"}`} />
      </button>

      <Link to={`/eventos/${event.id}`} className="block p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl text-gray-900 leading-tight mb-2">{event.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-grow">{event.shortDescription}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold mb-4 border-b border-gray-100 pb-4">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" />{formatDate(event.date)}</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{event.district}</span>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5 font-medium">
            <span className="flex items-center gap-1.5"><Ticket className="w-4 h-4 text-gray-400" />{event.ticketsLeft.toLocaleString("pt-PT")} disponíveis</span>
            <span className="font-bold text-gray-900 flex items-center gap-1"><svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>{event.rating}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${availability < 10 ? "bg-red-500" : availability < 40 ? "bg-yellow-400" : "bg-green-500"}`} style={{ width: `${Math.max(availability, 3)}%` }} />
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="flex items-center gap-1 text-sm font-bold text-black group-hover:underline transition-all">Compra o bilhete<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
          <span className="text-xl font-extrabold text-gray-900">{event.price}€</span>
        </div>
      </Link>
    </article>
  );
}

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(true);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [sortBy, setSortBy] = useState("date-asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const toggle = (setter, value) => {
    setter((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/eventos")
      .then((r) => r.json())
      .then((dados) => {
        // Mapear campos da BD para o formato do frontend
        const mapped = dados.map((e) => ({
          id: e.id_evento,
          title: e.titulo,
          description: e.descricao || "",
          shortDescription: e.descricao_curta || "",
          date: e.data_hora,
          price: Number(e.preco),
          category: e.categoria,
          district: e.distrito,
          venue: e.local_evento,
          address: e.morada,
          image: e.foto_evento,
          ticketsLeft: e.stock_disponivel,
          total: e.stock_disponivel,
          rating: Number(e.classificacao) || 0,
          trending: e.em_alta,
          isNew: e.novo,
        }));
        setEventos(mapped);
        setLoadingEventos(false);
      })
      .catch(() => setLoadingEventos(false));
  }, []);

  const clearFilters = () => {
    setSearch(""); setPriceRange([0, 100]); setSelectedCategories([]); setSelectedDistricts([]);
  };

  const filteredEvents = useMemo(() => {
    let result = eventos.filter((e) => {
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (e.price < priceRange[0] || e.price > priceRange[1]) return false;
      if (selectedCategories.length && !selectedCategories.includes(e.category)) return false;
      if (selectedDistricts.length && !selectedDistricts.includes(e.district)) return false;
      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-asc": return new Date(a.date) - new Date(b.date);
        case "date-desc": return new Date(b.date) - new Date(a.date);
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        default: return 0;
      }
    });
    return result;
  }, [search, priceRange, selectedCategories, selectedDistricts, sortBy, eventos]);

  const featured = eventos.filter((e) => e.trending).slice(0, 3);
  const activeFilterCount = selectedCategories.length + selectedDistricts.length + (priceRange[0] !== 0 || priceRange[1] !== 100 ? 1 : 0) + (search ? 1 : 0);

  const FilterBadge = ({ label, onRemove }) => (
    <button onClick={onRemove} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-900 border border-gray-200 text-xs font-bold rounded-full hover:bg-gray-200 transition-colors">
      {label} <X className="w-3 h-3" />
    </button>
  );

  const SidebarCheckboxList = ({ title, items, selected, setter }) => (
    <div className="bg-slate-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
      <h3 className="font-extrabold text-gray-900 mb-5 text-lg">{title}</h3>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-3 text-sm font-semibold text-gray-600 cursor-pointer hover:text-black transition-colors">
            <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(setter, item)} className="w-5 h-5 rounded border-gray-300 accent-black cursor-pointer" />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  const footerColumns = [
    { title: "Categorias", links: [{ label: "Música & Festivais", to: "#" }, { label: "Desporto", to: "#" }, { label: "Teatro & Arte", to: "#" }, { label: "Comédia", to: "#" }] },
    { title: "Suporte", links: [{ label: "Centro de Ajuda", to: "/suporte#ajuda" }, { label: "Como funciona o QR", to: "/suporte#qr" }, { label: "Contactos", action: () => setShowContactModal(true) }, { label: "FAQ", to: "/suporte#faq" }] },
    { title: "Legal", links: [{ label: "Termos e Condições", to: "#" }, { label: "Política de Privacidade", to: "#" }, { label: "Gestão de Cookies", to: "#" }] }
  ];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      <Navbar />

      <section className="bg-gray-950 pt-36 pb-20 px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12 text-center md:text-left mx-auto md:mx-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-6 !text-white">
              <Flame className="w-3.5 h-3.5 text-green-400" />
              Em destaque esta semana
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold !text-white mb-4 tracking-tight [text-shadow:_0_4px_12px_rgba(0,0,0,0.8)]">
              Vive os melhores momentos.
            </h1>
            <p className="text-lg md:text-xl !text-gray-300 font-medium [text-shadow:_0_2px_6px_rgba(0,0,0,0.8)]">
              Concertos, desporto, teatro e muito mais. Compra o teu bilhete em segundos sem burocracias.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featured.map((e) => (
              <Link key={e.id} to={`/eventos/${e.id}`} className="group flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 transition-all duration-300">
                <img src={e.image} alt={e.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform" />
                <div className="min-w-0 flex flex-col justify-center h-full">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2"><Clock className="w-3.5 h-3.5" />{formatDate(e.date)}</div>
                  <div className="font-bold text-white text-lg truncate mb-1">{e.title}</div>
                  <div className="text-sm font-semibold text-green-400">desde {e.price}€</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-[72px] z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisa eventos, artistas, locais..." className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-inner" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMobileFilters((v) => !v)} className="lg:hidden flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm">
              <SlidersHorizontal className="w-4 h-4" /> Filtros {activeFilterCount > 0 && <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-extrabold rounded-full">{activeFilterCount}</span>}
            </button>
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none px-6 py-3 pr-10 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-900 hover:border-gray-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black shadow-sm">
                {SORT_OPTIONS.map((opt) => (<option key={opt.id} value={opt.id}>{opt.label}</option>))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></div>
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mr-2">Filtros ativos:</span>
            {search && <FilterBadge label={`"${search}"`} onRemove={() => setSearch("")} />}
            {(priceRange[0] !== 0 || priceRange[1] !== 100) && <FilterBadge label={`${priceRange[0]}€ - ${priceRange[1]}€`} onRemove={() => setPriceRange([0, 100])} />}
            {selectedCategories.map((c) => <FilterBadge key={c} label={c} onRemove={() => toggle(setSelectedCategories, c)} />)}
            {selectedDistricts.map((d) => <FilterBadge key={d} label={d} onRemove={() => toggle(setSelectedDistricts, d)} />)}
            <button onClick={clearFilters} className="text-xs font-bold text-gray-500 hover:text-black hover:underline ml-2 transition-colors">Limpar tudo</button>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          
          <aside className={`${showMobileFilters ? "block" : "hidden"} lg:block space-y-6 lg:sticky lg:top-40 self-start`}>
            <div className="bg-slate-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-gray-900 mb-5 text-lg">Preço</h3>
              <div className="space-y-4">
                <input type="range" min="0" max="100" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full accent-black cursor-pointer" />
                <div className="flex items-center gap-3 text-sm font-bold">
                  <div className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-center shadow-inner">€ {priceRange[0]}</div>
                  <span className="text-gray-400">-</span>
                  <div className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-xl text-center shadow-inner">€ {priceRange[1]}</div>
                </div>
              </div>
            </div>
            <SidebarCheckboxList title="Categoria" items={CATEGORIES} selected={selectedCategories} setter={setSelectedCategories} />
            <SidebarCheckboxList title="Distrito" items={DISTRICTS} selected={selectedDistricts} setter={setSelectedDistricts} />
          </aside>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{filteredEvents.length} {filteredEvents.length === 1 ? "evento encontrado" : "eventos encontrados"}</h2>
            </div>
            {filteredEvents.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-gray-300 p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white flex items-center justify-center shadow-sm"><Search className="w-8 h-8 text-gray-300" /></div>
                <h3 className="font-extrabold text-xl text-gray-900 mb-2">Sem resultados</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Não encontrámos nenhum evento com estes filtros. Tenta ajustar a pesquisa ou o preço.</p>
                <button onClick={clearFilters} className="px-8 py-3.5 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition shadow-sm">Limpar todos os filtros</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="bg-gray-950 text-gray-400 py-16 px-8 border-t border-gray-900 mt-auto">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-sm">
          <div className="lg:col-span-2">
            <div className="text-xl font-bold flex items-center gap-2 mb-6 text-white"><span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass</div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">A tua plataforma de bilhética 100% digital. Rapidez, segurança e sustentabilidade no acesso aos teus eventos favoritos.</p>
          </div>
          {footerColumns.map((col, idx) => (
            <div key={idx}>
              <h4 className="font-bold mb-6 text-white tracking-wider uppercase text-xs">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.action ? (
                      <button onClick={link.action} className="hover:text-white transition-colors">{link.label}</button>
                    ) : (
                      <Link to={link.to} className="hover:text-white transition-colors">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-screen-2xl mx-auto border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} QuickPass Portugal. Todos os direitos reservados.</p>
        </div>
      </footer>

      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowContactModal(false)}></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowContactModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Contactos</h3>
            <p className="text-gray-500 text-sm mb-8">Precisas de falar connosco? Aqui tens os nossos detalhes.</p>
            <div className="space-y-6">
              <div className="flex items-start gap-4"><div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div><div><h4 className="font-bold text-gray-900 text-sm">Email</h4><a href="mailto:suporte@quickpass.pt" className="text-gray-600 text-sm hover:text-black hover:underline transition-colors">suporte@quickpass.pt</a></div></div>
              <div className="flex items-start gap-4"><div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><h4 className="font-bold text-gray-900 text-sm">Morada</h4><p className="text-gray-600 text-sm">Avenida da Liberdade, 100<br/>1250-096 Lisboa, Portugal</p></div></div>
              <div className="flex items-start gap-4"><div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg></div><div><h4 className="font-bold text-gray-900 text-sm">Fax</h4><p className="text-gray-600 text-sm">+351 210 000 000</p></div></div>
            </div>
            <button type="button" onClick={() => setShowContactModal(false)} className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition shadow-sm mt-10">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}