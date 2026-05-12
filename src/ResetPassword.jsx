import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    if (password !== confirmar) {
      setErro('As palavras-passe não coincidem.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/utilizadores/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, novaPassword: password }),
    });
    const dados = await res.json();
    setLoading(false);
    if (res.ok) {
      navigate('/login');
    } else {
      setErro(dados.erro || 'Erro ao redefinir palavra-passe.');
    }
  };

  return (
    <div className="font-sans min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Nova palavra-passe</h2>
        <p className="text-gray-500 text-sm mb-8">Introduz a tua nova palavra-passe.</p>
        {erro && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100">{erro}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Nova palavra-passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Nova palavra-passe"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Confirmar palavra-passe</label>
            <input
              type="password"
              required
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full p-4 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Repete a palavra-passe"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition disabled:opacity-70"
          >
            {loading ? 'A guardar...' : 'Guardar nova palavra-passe'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/login" className="font-bold text-black hover:underline">Voltar ao login</Link>
        </p>
      </div>
    </div>
  );
}
