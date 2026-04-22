import { Link } from 'react-router-dom';

export default function Registo() {
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
          <h1 className="text-4xl font-bold mb-8">Cria a tua própria conta !</h1>

          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Nome completo</label>
              <input 
                type="text" 
                className="w-full bg-gray-200 border border-transparent focus:bg-white focus:border-gray-400 focus:outline-none p-3 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full bg-gray-200 border border-transparent focus:bg-white focus:border-gray-400 focus:outline-none p-3 rounded"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Palavra - passe</label>
              <input 
                type="password" 
                className="w-full bg-gray-200 border border-transparent focus:bg-white focus:border-gray-400 focus:outline-none p-3 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1">Confirmar palavra - passe</label>
              <input 
                type="password" 
                className="w-full bg-gray-200 border border-transparent focus:bg-white focus:border-gray-400 focus:outline-none p-3 rounded"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition duration-200 mt-6">
              Criar Conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}