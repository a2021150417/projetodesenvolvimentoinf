import { useState } from "react";
import "./Auth.css";

export default function Register({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand" onClick={() => onNavigate("home")}>
          <div className="logo-mark">Q</div>
          QuickPass
        </div>
        <h1 className="auth-title">Junta-te<br />a <em>comunidade.</em></h1>
        <p className="auth-sub">Cria a tua conta e nunca percas um evento que importa.</p>
        <ul className="auth-perks">
          <li>Bilhetes digitais instantaneos</li>
          <li>Historico de compras</li>
          <li>Alertas de eventos favoritos</li>
          <li>10% de desconto na primeira compra</li>
        </ul>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-box-title">Criar conta</h2>
          <p className="auth-box-sub">Ja tens conta? <a href="#" onClick={() => onNavigate("login")}>Inicia sessao</a></p>
          <div className="auth-form">
            <div className="field">
              <label>Nome completo</label>
              <input type="text" name="name" placeholder="O teu nome" value={form.name} onChange={handle} />
            </div>
            <div className="field">
              <label>E-mail</label>
              <input type="email" name="email" placeholder="exemplo@email.com" value={form.email} onChange={handle} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" placeholder="Minimo 8 caracteres" value={form.password} onChange={handle} />
            </div>
            <div className="field">
              <label>Confirmar password</label>
              <input type="password" name="confirm" placeholder="Repete a password" value={form.confirm} onChange={handle} />
            </div>
            <label className="checkbox-label terms">
              <input type="checkbox" /> Aceito os <a href="#">Termos de Uso</a> e a <a href="#">Politica de Privacidade</a>
            </label>
            <button className="auth-btn">Criar conta</button>
          </div>
          <div className="auth-divider"><span>ou regista-te com</span></div>
          <div className="social-btns">
            <button className="social-btn">Google</button>
            <button className="social-btn">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
}
