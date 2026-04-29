import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Suporte() {
  const [openFaq, setOpenFaq] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const { hash } = useLocation();

  // --- LÓGICA DE AUTENTICAÇÃO ADICIONADA ---
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.reload();
  };

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      pergunta: "Como funciona a compra de bilhetes digitais?",
      resposta: "Após escolheres o evento e finalizares o pagamento com sucesso, o teu bilhete digital fica automaticamente associado à tua conta QuickPass. Não enviamos bilhetes por correio nem precisas de imprimir nada. Tudo vive no teu telemóvel!"
    },
    {
      pergunta: "Como posso aceder ao meu bilhete (QR Code)?",
      resposta: "Basta fazeres login na tua conta no nosso site. No teu painel principal, vais encontrar a secção 'Os Meus Bilhetes'. Ao clicares no evento, um código QR único será gerado no ecrã para apresentares à entrada."
    },
    {
      pergunta: "Posso transferir o meu bilhete para um amigo?",
      resposta: "Não. Os bilhetes são pessoais e intransmissíveis, não sendo possível transferi-los para outra pessoa."
    },
    {
      pergunta: "O que faço se ficar sem bateria no telemóvel no evento?",
      resposta: "Aconselhamos sempre que leves o telemóvel com bateria. No entanto, se o pior acontecer, dirige-te à bilheteira física do evento com o teu Cartão de Cidadão. A nossa equipa conseguirá encontrar a tua compra através do teu NIF."
    },
    {
      pergunta: "O meu pagamento falhou, o que devo fazer?",
      resposta: "Primeiro, verifica se tens saldo suficiente ou se o teu banco não bloqueou a transação por segurança. Se o dinheiro não saiu da tua conta, podes tentar fazer a compra novamente. Se o problema persistir, entra em contacto connosco. "
    },
    {
      pergunta: "Como pedir o reembolso de um evento cancelado?",
      resposta: "No caso de o promotor cancelar ou adiar o evento, a QuickPass processará automaticamente o reembolso para o mesmo método de pagamento utilizado na compra no prazo máximo de 14 dias úteis. Serás notificado por email."
    }
  ];

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      
      {/* --- NAVBAR INTELIGENTE --- */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/90 backdrop-blur-md border-b border-white/10 shadow-sm flex justify-between items-center px-8 py-4 text-white">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
        </Link>
        <div className="flex gap-5 items-center font-medium">
          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Bem-vindo, <span className="text-white font-bold">{userName}</span>!
              </span>
              <button 
                onClick={handleLogout} 
                className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest border border-red-400/30 px-3 py-1.5 rounded-full hover:bg-red-400/10 cursor-pointer"
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/registo" className="text-gray-300 hover:text-white transition-colors">Registar</Link>
              <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition shadow-sm font-semibold">Entrar</Link>
            </>
          )}
        </div>
      </nav>

      {/* Adicionado o id="ajuda" ao topo da página */}
      <section id="ajuda" className="bg-slate-50 pt-36 pb-20 px-8 relative overflow-hidden scroll-mt-20">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 text-center md:text-left">
          <div className="w-full md:w-1/2">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">Centro de Ajuda</h1>
            <p className="text-lg md:text-xl text-gray-600">Encontra as respostas que precisas para viveres o teu próximo evento.</p>
          </div>
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-80 h-56 bg-gray-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop" alt="Concerto" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-green-500"></div>
      </section>

      <div className="bg-white border-b border-gray-100 py-4 px-8">
        <div className="max-w-screen-xl mx-auto text-sm font-medium flex items-center gap-2">
          <Link to="/" className="text-gray-500 hover:text-black transition-colors">QuickPass</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Centro de Ajuda</span>
        </div>
      </div>

      <section className="py-16 px-8 flex-grow bg-white">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          
          <div className="lg:col-span-2 space-y-12">
            <div id="faq" className="scroll-mt-28">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Começar</h2>
              <p className="text-gray-600 mb-10 text-lg">Tudo o que precisas de saber sobre a tua jornada.</p>
              
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 p-8 md:p-10">
                <h3 className="font-bold text-xl mb-2 text-gray-900">Perguntas Frequentes</h3>
                <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">Esclarece as tuas dúvidas instantaneamente.</p>
                
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-slate-50 border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300">
                      <button onClick={() => toggleFaq(index)} className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-100 transition-colors focus:outline-none">
                        <span className="font-bold text-gray-900 pr-4">{faq.pergunta}</span>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <div className={`px-6 text-gray-600 text-sm leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {faq.resposta}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 blur-[80px] rounded-full transition-all group-hover:bg-green-500/30"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left max-w-md">
                  <h3 className="text-2xl font-bold mb-3">Não encontraste a resposta que procuravas?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">A nossa equipa está disponível para responder às tuas questões específicas.</p>
                </div>
                <button onClick={() => setShowContactModal(true)} className="bg-white text-black px-10 py-4 rounded-full font-bold text-sm hover:bg-green-500 hover:text-white transition-all shadow-xl shadow-black/20 flex-shrink-0">
                  Contactos
                </button>
              </div>
            </div>
          </div>

          <div>
            {/* Adicionado o id="qr" ao cartão do guia QR */}
            <div id="qr" className="bg-slate-50 p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-32 scroll-mt-32">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900">O teu QR Code</h3>
              </div>
              <p className="text-sm text-gray-600 mb-8">A entrada nos eventos nunca foi tão simples e segura. Vê como funciona:</p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">Compra</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">O bilhete fica imediatamente guardado em segurança na tua conta QuickPass.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">Acede</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">No dia do evento, abre a aba 'Os Meus Bilhetes'. O teu código QR dinâmico será gerado.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1">Mostra e Entra</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">Apresenta o teu ecrã à porta do evento. Um scan rápido e estás pronto para o espetáculo!</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center font-medium tracking-wide">♻️ 100% Digital e amigo do ambiente.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* NOVO POP-UP INFO DE CONTACTOS */}
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
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Email</h4>
                  <a href="mailto:suporte@quickpass.pt" className="text-gray-600 text-sm hover:text-black hover:underline transition-colors">suporte@quickpass.pt</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Morada</h4>
                  <p className="text-gray-600 text-sm">Avenida da Liberdade, 100<br/>1250-096 Lisboa, Portugal</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-full text-gray-900 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Fax</h4>
                  <p className="text-gray-600 text-sm">+351 210 000 000</p>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setShowContactModal(false)} className="w-full bg-black text-white p-4 rounded-full hover:bg-gray-800 font-bold transition shadow-sm mt-10">Fechar</button>
          </div>
        </div>
      )}

    </div>
  );
}