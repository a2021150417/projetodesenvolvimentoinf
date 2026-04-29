import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, RefreshCw } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Sou o assistente virtual da QuickPass. 🎟️", sender: "bot" },
    { id: 2, text: "Como te posso ajudar hoje?", sender: "bot" }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- O "CÉREBRO 2.0" DO CHATBOT ---
  const generateBotResponse = (userInput) => {
    // Normaliza o texto para minúsculas e remove acentos para facilitar a pesquisa
    const text = userInput.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // 1. Saudações
    if (text.includes('ola') || text.includes('bom dia') || text.includes('boa tarde') || text.includes('boa noite') || text.includes('boas')) {
      return "Olá! 😊 Bem-vindo à QuickPass. O que procuras hoje? Bilhetes, informações de conta, pagamentos ou ajuda com um evento?";
    }
    
    // 2. Compras e Bilhetes Genéricos
    if (text.includes('bilhete') || text.includes('comprar') || text.includes('preco') || text.includes('adquirir') || text.includes('custo')) {
      return "Para comprares bilhetes, basta ires à nossa secção de Eventos, escolheres o espetáculo e clicares em 'Comprar'. O bilhete fica logo associado à tua conta! Precisas de ajuda com algum evento específico?";
    }

    // 3. Pagamentos e Faturas
    if (text.includes('pagamento') || text.includes('pagar') || text.includes('mbway') || text.includes('cartao') || text.includes('multibanco')) {
      return "Aceitamos os métodos de pagamento mais seguros: MB WAY, Cartão de Crédito/Débito (Visa, Mastercard) e Referência Multibanco. O processo é 100% encriptado! 🔒";
    }
    if (text.includes('fatura') || text.includes('recibo') || text.includes('nif')) {
      return "A tua fatura com NIF é gerada automaticamente após a compra. Podes descarregá-la a qualquer momento na tua área de cliente, na secção 'Histórico de Compras'.";
    }

    // 4. QR Code e Entrada nos Eventos
    if (text.includes('qr code') || text.includes('qr') || text.includes('entrada') || text.includes('entrar') || text.includes('porta')) {
      return "O teu QR Code é a tua chave! 📱 No dia do evento, basta fazeres login, ires a 'Os Meus Bilhetes' e abrires o evento. Mostra o ecrã à porta e já está. Nada de imprimir papéis!";
    }

    // 5. Reembolsos e Cancelamentos
    if (text.includes('reembolso') || text.includes('cancelado') || text.includes('devolver') || text.includes('devolucao')) {
      return "Se um evento for cancelado ou adiado, a QuickPass processa o reembolso de forma automática para o mesmo método de pagamento utilizado, num prazo máximo de 14 dias úteis.";
    }

    // 6. Problemas de Conta / Password
    if (text.includes('password') || text.includes('passe') || text.includes('senha') || text.includes('esqueci') || text.includes('login')) {
      return "Esqueceste-te da palavra-passe? Acontece aos melhores! Vai à nossa página de Login e clica em 'Esqueceu-se da palavra-passe?' para te enviarmos um link seguro de recuperação.";
    }

    // 7. Contactos e Suporte Humano
    if (text.includes('contacto') || text.includes('contactos') || text.includes('falar') || text.includes('ligar') || text.includes('email') || text.includes('telefone') || text.includes('humano')) {
      return "Podes falar com a nossa equipa humana! 👨‍💻 Envia-nos um email para suporte@quickpass.pt ou liga para o +351 210 000 000. Estamos disponíveis das 9h às 18h.";
    }

    // 8. Idades e Crianças
    if (text.includes('idade') || text.includes('crianca') || text.includes('menor') || text.includes('bebe')) {
      return "A classificação etária varia de evento para evento. Recomendamos que verifiques as informações específicas na página do evento que queres assistir. Por norma, crianças até aos 3 anos não pagam bilhete em recintos abertos, mas confirma sempre!";
    }

    // 9. EVENTOS ESPECÍFICOS (Lendo a mente do utilizador)
    if (text.includes('travis') || text.includes('scott') || text.includes('utopia') || text.includes('rap')) {
      return "O concerto do Travis Scott vai ser épico! 🔥 Vai acontecer no dia 14 de Fevereiro na Altice Arena. Corre para a nossa página de eventos porque os bilhetes estão a voar (a partir de 90€)!";
    }
    if (text.includes('benfica') || text.includes('porto') || text.includes('futebol') || text.includes('classico')) {
      return "O grande clássico Benfica x Porto está marcado para 17 de Março no Estádio da Luz! Temos bilhetes a partir de 55€. Prepara o cachecol e garante já o teu lugar na secção de Eventos.";
    }
    if (text.includes('alive') || text.includes('nos') || text.includes('festival') || text.includes('meco')) {
      return "Adoras festivais? Temos passes diários para o NOS Alive a 79€ e passes gerais a 179€. Prepara-te para os melhores dias de verão no Passeio Marítimo de Algés!";
    }
    if (text.includes('comedia') || text.includes('levanta') || text.includes('stand up') || text.includes('rir')) {
      return "Garantimos-te umas boas gargalhadas! O 'Levanta-te e Ri' vai estar no Coliseu do Porto no dia 26 de Novembro. Bilhetes super acessíveis a partir de 25€.";
    }
    if (text.includes('fantasma') || text.includes('opera') || text.includes('teatro')) {
      return "O Fantasma da Ópera é uma produção deslumbrante que vai estar no Coliseu dos Recreios. Tens lugares na plateia e no balcão a partir de 45€.";
    }
    if (text.includes('tenis') || text.includes('masters')) {
      return "Os Masters of Tennis vão trazer os grandes nomes mundiais à Quinta do Lago no dia 1 de Fevereiro. É um evento de luxo com bilhetes a partir de 35€.";
    }

    // 10. Agradecimentos
    if (text.includes('obrigado') || text.includes('obrigada') || text.includes('valeu') || text.includes('top')) {
      return "Ora essa, é para isso que cá estou! Se precisares de mais alguma coisa, avisa. Diverte-te muito com a QuickPass! 🎉";
    }

    // Resposta padrão caso ele não saiba o que responder
    return "Hum, não tenho a certeza se percebi tudo. 🤔 Consigo ajudar-te com compras, pagamentos, faturas, o uso do QR Code, reembolsos, eventos específicos ou recuperação de conta. Podes reformular a pergunta?";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), text: inputValue, sender: "user" };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    const responseText = generateBotResponse(inputValue);
    const typingDelay = Math.min(Math.max(responseText.length * 15, 1000), 2500);

    setTimeout(() => {
      const botResponse = { id: Date.now() + 1, text: responseText, sender: "bot" };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, typingDelay);
  };

  const handleReset = () => {
    setMessages([
      { id: 1, text: "Olá! Sou o assistente virtual da QuickPass. 🎟️", sender: "bot" },
      { id: 2, text: "Como te posso ajudar hoje?", sender: "bot" }
    ]);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 z-[100] w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-all duration-300 hover:scale-105 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <MessageSquare className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>

      <div className={`fixed bottom-6 right-6 z-[100] w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl shadow-black/20 border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`} style={{ height: '500px', maxHeight: 'calc(100vh - 6rem)' }}>
        <div className="bg-gray-950 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Assistente QuickPass</h3>
              <p className="text-[10px] text-green-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="p-2 text-gray-400 hover:text-white transition-colors" title="Reiniciar Chat">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-grow p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3.5 text-sm rounded-2xl leading-relaxed ${msg.sender === 'user' ? 'bg-black text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl rounded-bl-sm flex gap-1.5">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Pergunta algo ao assistente..." className="w-full pl-5 pr-12 py-3.5 bg-slate-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all" />
            <button type="submit" disabled={!inputValue.trim() || isTyping} className="absolute right-2 w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black transition-all">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}