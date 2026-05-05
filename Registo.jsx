import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registo() {
  // --- ESTADOS PARA GUARDAR OS DADOS DO FORMULÁRIO ---
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- FUNÇÃO QUE ENVIA PARA A BASE DE DADOS ---
  const handleRegisto = async (e) => {
    e.preventDefault();
    setErro('');

    if (password !== confirmPassword) {
      return setErro('As palavras-passe não coincidem.');
    }

    setLoading(true);

    try {
      const resposta = await fetch('http://localhost:3001/api/utilizadores/registo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert('Conta criada com sucesso! Já podes fazer login.');
        navigate('/login');
      } else {
        setErro(dados.mensagem || 'Erro ao criar conta. Este email já pode estar em uso.');
      }
    } catch (error) {
      setErro('Não foi possível ligar ao servidor. Verifica se o backend está a correr.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-100">
      
      {/* --- PAINEL ESQUERDO: Imagem e Marca --- */}
      <div className="relative overflow-hidden bg-gray-900 order-last lg:order-first lg:sticky lg:top-0 lg:h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540039155732-61ee14b12631?q=80&w=1920&auto=format&fit=crop')" }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/60 to-gray-950 z-0"></div>
        
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <Link to="/" className="text-xl font-bold flex items-center gap-2 w-max">
            <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
          </Link>
          
          <div className="max-w-md">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Junta-te à Comunidade</p>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight !text-white [text-shadow:_0_4px_12px_rgba(0,0,0,0.8)]">
              A tua porta de entrada para experiências únicas.
            </h1>
            <p className="text-gray-300 mt-6 text-lg leading-relaxed">
              Cria a tua conta em segundos e acede aos bilhetes mais procurados de Portugal. Rápido, seguro e 100% digital.
            </p>
          </div>
          
          <p className="text-sm font-medium text-gray-400/80 mt-6">
            © {new Date().getFullYear()} QuickPass Portugal.
          </p>
        </div>
      </div>

      {/* --- PAINEL DIREITO: Formulário de Registo --- */}
      <div className="flex items-center justify-center p-8 lg:p-16 xl:p-24 bg-slate-100">
        <div className="bg-white p-12 rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 w-full max-w-lg">
          
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-black flex items-center gap-2 mb-12 w-max">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7" /></svg>
            Voltar para a página inicial
          </Link>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">Cria a tua conta!</h2>
          
          {/* AVISO DE ERRO */}
          {erro && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold mb-6 border border-red-100">
              {erro}
            </div>
          )}
          
          {/* FORMULÁRIO COM O EVENTO ONSUBMIT */}
          <form onSubmit={handleRegisto} className="space-y-6">
            
            <div>
              <label htmlFor="nome" className="block text-sm font-bold text-gray-900 mb-2">Nome completo</label>
              <input 
                type="text" 
                id="nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 shadow-inner transition-shadow" 
                placeholder="Ex: João Silva" 
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input 
                type="email" 
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 shadow-inner transition-shadow" 
                placeholder="Ex: joao.silva@email.com" 
              />
            </div>

            <div>
              <label htmlFor="pass" className="block text-sm font-bold text-gray-900 mb-2">Palavra-passe</label>
              <input 
                type="password" 
                id="pass"
                required
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 shadow-inner transition-shadow" 
                placeholder="Pelo menos 8 caracteres" 
              />
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-sm font-bold text-gray-900 mb-2">Confirmar palavra-passe</label>
              <input 
                type="password" 
                id="confirm-pass"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 shadow-inner transition-shadow" 
                placeholder="Repete a palavra-passe" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition shadow-sm mt-10 disabled:opacity-70">
              {loading ? 'A criar conta...' : 'Criar Conta'}
            </button>
            
          </form>
          
          <p className="text-center text-sm text-gray-600 mt-10">
            Já tens conta? <Link to="/login" className="font-bold text-black hover:underline underline-offset-2">Entrar →</Link>
          </p>
          
        </div>
      </div>
    </div>
  );
}