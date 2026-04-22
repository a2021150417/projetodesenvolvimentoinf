import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Lado Esquerdo - Imagem/Cor */}
      <div className="hidden lg:block lg:w-1/2 bg-gray-300">
        {/* Podes colocar uma imagem de fundo aqui no futuro */}
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col px-8 py-12 md:px-24 justify-center relative">
        
        <Link to="/" className="absolute top-8 left-8 md:left-24 font-bold text-sm hover:underline flex items-center gap-2">
          ← Voltar para a página inicial
        </Link>

        <div className="max-w-md w-full mt-16">
          <h1 className="text-4xl font-bold mb-2">Bem-Vindo ao QuickPass !</h1>
          <p className="text-sm text-gray-600 mb-8">
            <Link to="/registo" className="font-bold underline hover:text-black">Cria uma conta nova</Link> ou faz login com uma conta já existente.
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-gray-200 border border-transparent focus:bg-white focus:border-gray-400 focus:outline-none p-3 rounded"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-gray-200 border border-transparent focus:bg-white focus:border-gray-400 focus:outline-none p-3 rounded"
              />
              <div className="text-right mt-2">
                <a href="#" className="text-xs text-gray-500 hover:underline">Esqueceu-se da palavra-passe?</a>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition duration-200 mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}