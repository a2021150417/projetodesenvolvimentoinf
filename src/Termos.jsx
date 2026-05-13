import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Termos() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">← Voltar ao início</Link>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Termos e Condições</h1>
        <p className="text-sm text-gray-400 mb-10">Última atualização: maio de 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
            <p>Ao aceder e utilizar a plataforma QuickPass, aceita ficar vinculado aos presentes Termos e Condições. Caso não concorde com algum dos termos aqui descritos, deverá cessar imediatamente a utilização dos nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Descrição do Serviço</h2>
            <p>A QuickPass é uma plataforma de bilhética digital que permite aos utilizadores adquirir bilhetes para eventos de forma rápida, segura e sustentável. Os bilhetes são emitidos em formato digital com código QR único.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Conta de Utilizador</h2>
            <p>Para adquirir bilhetes, é necessário criar uma conta. O utilizador é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas com a sua conta. A QuickPass reserva-se o direito de suspender ou encerrar contas que violem estes termos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Compra e Pagamento</h2>
            <p>Todas as transações são processadas de forma segura. Os preços apresentados incluem IVA à taxa legal em vigor. Após a confirmação do pagamento, o bilhete digital é disponibilizado imediatamente na conta do utilizador. As compras são definitivas e não são reembolsáveis, salvo em caso de cancelamento do evento pelo organizador.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cancelamento de Eventos</h2>
            <p>Em caso de cancelamento de um evento, a QuickPass contactará os detentores de bilhetes com as instruções de reembolso. O reembolso será processado no prazo de 14 dias úteis para o método de pagamento original.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Utilização dos Bilhetes</h2>
            <p>Cada bilhete digital possui um código QR único de utilização única. A partilha ou revenda de bilhetes é estritamente proibida. A QuickPass não se responsabiliza por bilhetes obtidos através de canais não oficiais.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Propriedade Intelectual</h2>
            <p>Todo o conteúdo presente na plataforma QuickPass, incluindo logótipos, design, textos e código, é propriedade exclusiva da QuickPass e está protegido por direitos de autor. A reprodução não autorizada é proibida.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitação de Responsabilidade</h2>
            <p>A QuickPass não se responsabiliza por quaisquer danos indiretos resultantes da utilização da plataforma, nem pela qualidade ou conteúdo dos eventos cujos bilhetes são comercializados.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Alterações aos Termos</h2>
            <p>A QuickPass reserva-se o direito de alterar estes Termos e Condições a qualquer momento. As alterações entram em vigor imediatamente após publicação. O uso continuado da plataforma após alterações constitui aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contacto</h2>
            <p>Para questões relacionadas com estes Termos e Condições, contacte-nos através de <span className="font-medium text-black">suporte@quickpass.pt</span>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
