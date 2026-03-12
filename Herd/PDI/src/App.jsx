import { useState } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

const EVENTS = [
  { id:1, title:"Arctic Monkeys",   category:"Concerto",    date:"12 Abr 2026", location:"Lisboa - Altice Arena",     price:"65EUR" },
  { id:2, title:"Hamlet",           category:"Teatro",      date:"20 Mar 2026", location:"Porto - Teatro Rivoli",      price:"28EUR" },
  { id:3, title:"NOS Alive 2026",   category:"Festival",    date:"9 Jul 2026",  location:"Lisboa - Passeio Maritimo", price:"89EUR" },
  { id:4, title:"Benfica vs Porto", category:"Desporto",    date:"5 Abr 2026",  location:"Lisboa - Estadio da Luz",   price:"45EUR" },
  { id:5, title:"Billie Eilish",    category:"Concerto",    date:"18 Mai 2026", location:"Lisboa - Altice Arena",     price:"72EUR" },
  { id:6, title:"Cirque du Soleil", category:"Espectaculo", date:"1 Jun 2026",  location:"Braga - Parque Desportivo", price:"55EUR" },
];

const CATS = [
  { icon:"🎸", name:"Concertos", count:142 },
  { icon:"🎭", name:"Teatro",    count:87  },
  { icon:"🎪", name:"Festivais", count:34  },
  { icon:"⚽", name:"Desporto",  count:210 },
  { icon:"🎤", name:"Stand-Up",  count:56  },
  { icon:"🎠", name:"Familia",   count:93  },
];

const FILTERS = ["Todos", "Concerto", "Teatro", "Festival", "Desporto", "Espectaculo"];

const CAT_COLORS = {
  "Concerto":    "#c9a84c",
  "Teatro":      "#e8956a",
  "Festival":    "#7aab70",
  "Desporto":    "#7aa8c4",
  "Espectaculo": "#e887c5",
};

const STEPS = [
  ["01","Encontra o teu evento",    "Pesquisa por artista, categoria, data ou cidade no nosso catalogo."],
  ["02","Escolhe os teus bilhetes", "Seleciona a quantidade e tipo de lugar. Sem taxas escondidas."],
  ["03","Paga em seguranca",        "MB Way, Multibanco, cartao ou PayPal. Pagamentos encriptados."],
  ["04","Apresenta o bilhete",      "O teu QR Code chega ao e-mail. Mostra na entrada - sem papel."],
];

const FOOTER_COLS = [
  { title:"Eventos", links:["Concertos","Teatro e Danca","Festivais","Desporto","Stand-Up"] },
  { title:"Conta",   links:["Iniciar sessao","Criar conta","Os meus bilhetes","Historico"]  },
  { title:"Suporte", links:["Centro de ajuda","Reembolsos","Termos de uso","Contacto"]     },
];

function groupByCategory(events) {
  return events.reduce((acc, ev) => {
    if (!acc[ev.category]) acc[ev.category] = [];
    acc[ev.category].push(ev);
    return acc;
  }, {});
}

function Navbar({ onNavigate }) {
  return (
    <header className="nav">
      <div className="logo" onClick={() => onNavigate("home")} style={{ cursor:"pointer" }}>
        <div className="logo-mark">Q</div>
        QuickPass
      </div>
      <nav className="nav-links">
        {["Concertos","Teatro","Festivais","Desporto","Stand-Up"].map(l => (
          <a key={l} href="#">{l}</a>
        ))}
      </nav>
      <div className="nav-actions">
        <button className="btn btn-outline" onClick={() => onNavigate("login")}>Entrar</button>
        <button className="btn btn-solid" onClick={() => onNavigate("register")}>Registar</button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-eyebrow">A tua plataforma de bilhetes</div>
      <h1 className="hero-title">Vive <em>cada</em><br />momento.</h1>
      <p className="hero-sub">Os melhores concertos, teatro, festivais e desporto de Portugal.</p>
      <div className="hero-actions">
        <button className="btn-hero">Explorar eventos</button>
        <a href="#como-funciona" className="hero-ghost">Como funciona</a>
      </div>
      <div className="hero-stats">
        {[["500+","Eventos"],["12K","Clientes"],["4.9","Avaliacao"]].map(([n,l]) => (
          <div key={l}>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SearchBar() {
  return (
    <div className="search-wrap">
      <div className="search-inner">
        <div className="search-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a09890" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <div><span className="search-label">Evento ou artista</span><input className="search-input" placeholder="Ex: Arctic Monkeys..." /></div>
        </div>
        <div className="search-field">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a09890" strokeWidth="1.5"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <div><span className="search-label">Cidade</span><input className="search-input" placeholder="Lisboa, Porto, Braga..." /></div>
        </div>
        <button className="search-btn">Pesquisar</button>
      </div>
    </div>
  );
}

function Categories() {
  return (
    <section className="section">
      <div className="section-label">Categorias</div>
      <h2 className="section-title">Encontra o que <em>procuras.</em></h2>
      <div className="cat-grid">
        {CATS.map(c => (
          <div key={c.name} className="cat-item">
            <span className="cat-emoji">{c.icon}</span>
            <span className="cat-name">{c.name}</span>
            <span className="cat-count">{c.count} eventos</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventCard({ ev, color }) {
  return (
    <article className="ev-card">
      <span className="ev-cat" style={{ color, borderColor: color + "55" }}>{ev.category}</span>
      <h3 className="ev-title">{ev.title}</h3>
      <div className="ev-info">
        <div className="ev-date">{ev.date}<br />{ev.location}</div>
        <div><span className="ev-from">A partir de</span><div className="ev-price">{ev.price}</div></div>
      </div>
      <div className="ev-arrow">-&gt;</div>
    </article>
  );
}

function Events() {
  const [active, setActive] = useState("Todos");
  const filtered = active === "Todos" ? EVENTS : EVENTS.filter(e => e.category === active);
  const grouped = groupByCategory(filtered);

  return (
    <section className="section events">
      <div className="section-label">Em Destaque</div>
      <h2 className="section-title">Proximos <em>eventos.</em></h2>
      <div className="filter-row">
        {FILTERS.map(f => (
          <button key={f} className={`filter-btn${active === f ? " active" : ""}`} onClick={() => setActive(f)}>
            {f}
          </button>
        ))}
      </div>
      {Object.entries(grouped).map(([cat, evs]) => (
        <div key={cat} className="ev-group">
          <div className="ev-group-title" style={{ color: CAT_COLORS[cat] }}>
            <span className="ev-group-line" style={{ background: CAT_COLORS[cat] }} />
            {cat}
            <span className="ev-group-count">{evs.length} evento{evs.length > 1 ? "s" : ""}</span>
          </div>
          <div className="ev-grid">
            {evs.map(ev => (
              <EventCard key={ev.id} ev={ev} color={CAT_COLORS[ev.category]} />
            ))}
          </div>
        </div>
      ))}
      <div className="ev-footer">
        <button className="btn-all">Ver todos os eventos</button>
        <span className="ev-count">Mostrando {filtered.length} de 500+ eventos</span>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="section how">
      <div className="how-grid">
        <div>
          <div className="section-label">Processo</div>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Simples como<br />deve <em>ser.</em></h2>
        </div>
        <div className="how-steps">
          {STEPS.map(([n, t, d]) => (
            <div key={n} className="how-step">
              <div className="step-n">{n}</div>
              <div><div className="step-t">{t}</div><p className="step-d">{d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="newsletter">
      <div>
        <div className="nl-eyebrow">Oferta de boas-vindas</div>
        <h2 className="nl-title"><strong>10% de desconto</strong><br />na tua primeira compra.</h2>
        <p className="nl-desc">Subscreve e recebe o codigo diretamente no teu e-mail.</p>
      </div>
      <div>
        <div className="nl-row">
          <input className="nl-input" type="email" placeholder="O teu e-mail..." />
          <button className="nl-btn">Subscrever</button>
        </div>
        <p className="nl-note">Sem spam. Cancela quando quiseres.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="logo" style={{ color: "#f5f0e8" }}>
            <div className="logo-mark">Q</div>
            QuickPass
          </div>
          <p className="footer-desc">A tua plataforma de referencia para bilhetes em Portugal.</p>
        </div>
        {FOOTER_COLS.map(col => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            {col.links.map(l => <a key={l} href="#">{l}</a>)}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span>2026 QuickPass - Todos os direitos reservados.</span>
        <span>Desenvolvido em Portugal</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "login")    return <Login    onNavigate={setPage} />;
  if (page === "register") return <Register onNavigate={setPage} />;

  return (
    <>
      <Navbar onNavigate={setPage} />
      <Hero />
      <SearchBar />
      <Categories />
      <Events />
      <HowItWorks />
      <Newsletter />
      <Footer />
    </>
  );
}
