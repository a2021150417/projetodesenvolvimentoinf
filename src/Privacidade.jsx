import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Privacidade() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">← Voltar ao início</Link>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Política de Privacidade</h1>
        <p className="text-sm text-gray-400 mb-10">Última atualização: maio de 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Responsável pelo Tratamento</h2>
            <p>A QuickPass Portugal é a entidade responsável pelo tratamento dos seus dados pessoais, em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) e a legislação nacional aplicável.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Dados que Recolhemos</h2>
            <p>Recolhemos os seguintes dados pessoais:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Informações de registo: nome, endereço de email, palavra-passe (cifrada)</li>
              <li>Dados de perfil: fotografia, preferências de eventos</li>
              <li>Dados de transação: historial de compras, bilhetes adquiridos</li>
              <li>Dados de utilização: páginas visitadas, interações na plataforma</li>
              <li>Dados técnicos: endereço IP, tipo de browser, dispositivo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Finalidade do Tratamento</h2>
            <p>Os seus dados são utilizados para:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Gestão da sua conta e autenticação</li>
              <li>Processamento de compras e emissão de bilhetes</li>
              <li>Comunicações relacionadas com os seus bilhetes e eventos</li>
              <li>Melhoria da plataforma e personalização da experiência</li>
              <li>Cumprimento de obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Base Legal</h2>
            <p>O tratamento dos seus dados baseia-se na execução do contrato de prestação de serviços (compra de bilhetes), no consentimento dado no momento do registo, e no cumprimento de obrigações legais a que a QuickPass está sujeita.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Partilha de Dados</h2>
            <p>Não vendemos os seus dados pessoais a terceiros. Podemos partilhar dados com organizadores de eventos (apenas o necessário para validação de bilhetes) e com prestadores de serviços tecnológicos que nos auxiliam na operação da plataforma, sempre sob acordos de confidencialidade.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Conservação dos Dados</h2>
            <p>Os seus dados são conservados durante o período em que a sua conta estiver ativa e pelo prazo legalmente exigido após o encerramento. Dados de transação são mantidos por 10 anos para efeitos fiscais.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Os Seus Direitos</h2>
            <p>Ao abrigo do RGPD, tem direito a:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Aceder aos seus dados pessoais</li>
              <li>Retificar dados inexatos</li>
              <li>Solicitar o apagamento dos dados ("direito a ser esquecido")</li>
              <li>Opor-se ao tratamento para fins de marketing</li>
              <li>Portabilidade dos dados</li>
              <li>Apresentar reclamação à CNPD (Comissão Nacional de Proteção de Dados)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Segurança</h2>
            <p>Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados contra acesso não autorizado, perda ou destruição, incluindo encriptação de dados sensíveis e comunicações HTTPS.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contacto</h2>
            <p>Para exercer os seus direitos ou para qualquer questão sobre privacidade, contacte o nosso responsável pela proteção de dados em <span className="font-medium text-black">privacidade@quickpass.pt</span>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
