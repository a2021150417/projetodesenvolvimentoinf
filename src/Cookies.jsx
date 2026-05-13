import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function Cookies() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <Link to="/" className="text-sm text-gray-500 hover:text-black transition-colors">← Voltar ao início</Link>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Gestão de Cookies</h1>
        <p className="text-sm text-gray-400 mb-10">Última atualização: maio de 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">O que são Cookies?</h2>
            <p>Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um website. Permitem que o site recorde as suas preferências e melhore a sua experiência de navegação.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies que Utilizamos</h2>

            <div className="space-y-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Cookies Essenciais</h3>
                  <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">Sempre ativos</span>
                </div>
                <p className="text-sm">Necessários para o funcionamento básico da plataforma. Incluem cookies de sessão e autenticação. Não podem ser desativados.</p>
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <div className="flex gap-4"><span className="font-medium w-32">quickpass_session</span><span>Sessão de utilizador autenticado</span></div>
                  <div className="flex gap-4"><span className="font-medium w-32">cart_token</span><span>Estado do carrinho de compras</span></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Cookies de Preferências</h3>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Opcionais</span>
                </div>
                <p className="text-sm">Guardam as suas preferências para personalizar a experiência, como idioma, filtros de pesquisa e favoritos.</p>
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  <div className="flex gap-4"><span className="font-medium w-32">qp_favorites</span><span>Eventos marcados como favoritos</span></div>
                  <div className="flex gap-4"><span className="font-medium w-32">qp_filters</span><span>Últimos filtros de pesquisa utilizados</span></div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Cookies Analíticos</h3>
                  <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Opcionais</span>
                </div>
                <p className="text-sm">Recolhem informações anónimas sobre como os utilizadores interagem com a plataforma, ajudando-nos a melhorar o serviço. Não identificam utilizadores individuais.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Como Gerir os Cookies</h2>
            <p>Pode controlar e/ou eliminar cookies conforme desejar através das definições do seu browser:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><span className="font-medium">Chrome:</span> Definições → Privacidade e Segurança → Cookies</li>
              <li><span className="font-medium">Firefox:</span> Opções → Privacidade e Segurança</li>
              <li><span className="font-medium">Safari:</span> Preferências → Privacidade</li>
              <li><span className="font-medium">Edge:</span> Definições → Cookies e permissões do site</li>
            </ul>
            <p className="mt-3">Note que desativar cookies essenciais pode afetar o funcionamento da plataforma, impedindo, por exemplo, a autenticação ou a conclusão de compras.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Cookies de Terceiros</h2>
            <p>A QuickPass pode utilizar serviços de terceiros (como processadores de pagamento) que instalem os seus próprios cookies. Esses cookies estão sujeitos às políticas de privacidade dos respetivos terceiros.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Contacto</h2>
            <p>Para questões sobre a nossa política de cookies, contacte-nos em <span className="font-medium text-black">privacidade@quickpass.pt</span>.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
