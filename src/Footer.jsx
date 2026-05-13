import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      <footer className="bg-gray-950 text-gray-400 py-16 px-8 border-t border-gray-900 mt-auto">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-sm">
          <div className="lg:col-span-2">
            <div className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
              <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-6">
              A tua plataforma de bilhética 100% digital. Rapidez, segurança e sustentabilidade no acesso aos teus eventos favoritos.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white tracking-wider uppercase text-xs">Categorias</h4>
            <ul className="space-y-3">
              <li><Link to="/eventos?categoria=Música" className="hover:text-white transition-colors">Música & Festivais</Link></li>
              <li><Link to="/eventos?categoria=Desporto" className="hover:text-white transition-colors">Desporto</Link></li>
              <li><Link to="/eventos?categoria=Teatro" className="hover:text-white transition-colors">Teatro & Arte</Link></li>
              <li><Link to="/eventos?categoria=Comédia" className="hover:text-white transition-colors">Comédia</Link></li>
            </ul>
          </div>

          <div>
            <Link
              to="/suporte"
              className="block font-bold mb-6 text-white tracking-wider uppercase text-xs hover:text-gray-300 hover:underline underline-offset-4 transition-all w-max cursor-pointer"
            >
              Suporte
            </Link>
            <ul className="space-y-3">
              <li><Link to="/suporte#ajuda" className="hover:text-white transition-colors">Centro de Ajuda</Link></li>
              <li><Link to="/suporte#qr" className="hover:text-white transition-colors">Como funciona o QR</Link></li>
              <li>
                <button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">
                  Contactos
                </button>
              </li>
              <li><Link to="/suporte#faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white tracking-wider uppercase text-xs">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/termos" className="hover:text-white transition-colors">Termos e Condições</Link></li>
              <li><Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Gestão de Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-screen-2xl mx-auto border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} QuickPass Portugal. Todos os direitos reservados.</p>
        </div>
      </footer>

      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowContactModal(false)}
          ></div>
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Contactos</h3>
            <p className="text-gray-500 text-sm mb-8">Precisas de falar connosco? Aqui tens os nossos detalhes.</p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Email</h4>
                  <a href="mailto:suporte@quickpass.pt" className="text-gray-600 text-sm hover:text-black hover:underline transition-colors">
                    suporte@quickpass.pt
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Morada</h4>
                  <p className="text-gray-600 text-sm">Avenida da Liberdade, 100<br />1250-096 Lisboa, Portugal</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Fax</h4>
                  <p className="text-gray-600 text-sm">+351 210 000 000</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition shadow-sm mt-10"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
