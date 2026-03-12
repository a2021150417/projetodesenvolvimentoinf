import { useState } from "react";
import "./Auth.css";

export default function Login({ onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand" onClick={() => onNavigate("home")}>
          <div className="logo-mark">Q</div>
          QuickPass
        </div>
        <h1 className="auth-title">Bem-vindo<br /><em>de volta.</em></h1>
        <p className="auth-sub">Acede a tua conta e volta a viver os melhores momentos.</p>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h2 className="auth-box-title">Iniciar sessao</h2>
          <p className="auth-box-sub">Nao tens conta? <a href="#" onClick={() => onNavigate("register")}>Regista-te</a></p>
          <div className="auth-form">
            <div className="field">
              <label>E-mail</label>
              <input type="email" name="email" placeholder="exemplo@email.com" value={form.email} onChange={handle} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" placeholder="A tua password" value={form.password} onChange={handle} />
            </div>
            <div className="field-row">
              <label className="checkbox-label"><input type="checkbox" /> Lembrar-me</label>
              <a href="#" className="forgot">Esqueceste a password?</a>
            </div>
            <button className="auth-btn">Entrar</button>
          </div>
          <div className="auth-divider"><span>ou continua com</span></div>
          <div className="social-btns">
            <button className="social-btn">Google</button>
            <button className="social-btn">Apple</button>
          </div>
        </div>
      </div>
    </div>
  );
}
