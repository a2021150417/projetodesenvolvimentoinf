import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RecuperarPassword() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/utilizadores/recuperar-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setEnviado(true);
    setLoading(false);
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-2 mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7" /></svg>
          Voltar ao login
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Esqueceu a password?</h2>
        <p className="text-gray-500 text-sm mb-8">Introduz o teu email e enviamos um link para redefinires a tua palavra-passe.</p>
        {enviado ? (
          <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl p-5 text-sm font-semibold text-center">
            Se o email existir na nossa base de dados, receberás um link em breve.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="O teu email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition disabled:opacity-70"
            >
              {loading ? 'A enviar...' : 'Enviar link de recuperação'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
