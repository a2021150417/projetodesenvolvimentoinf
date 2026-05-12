import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle2, XCircle, QrCode, ChevronLeft, Ticket, Calendar, User } from "lucide-react";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}

export default function LeitorQR() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const [estado, setEstado] = useState("idle"); // idle | scanning | success | error
  const [resultado, setResultado] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    return () => {
      // Parar câmara ao sair da página
      if (html5QrcodeRef.current) {
        html5QrcodeRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const iniciarScanner = async () => {
    setEstado("scanning");
    setResultado(null);
    setMensagem("");

    // Aguardar DOM estar pronto
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const html5Qrcode = new Html5Qrcode("qr-reader");
    html5QrcodeRef.current = html5Qrcode;

    try {
      await html5Qrcode.start(
        { facingMode: "environment" }, // câmara traseira
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (codigoQR) => {
          // QR code detetado!
          await html5Qrcode.stop();
          setEstado("loading");
          await validarBilhete(codigoQR);
        },
        () => {} // erro de leitura (ignora frames sem QR)
      );
    } catch (err) {
      setEstado("error");
      setMensagem("Não foi possível aceder à câmara. Verifica as permissões.");
    }
  };

  const pararScanner = async () => {
    if (html5QrcodeRef.current) {
      await html5QrcodeRef.current.stop().catch(() => {});
    }
    setEstado("idle");
  };

  const validarBilhete = async (codigoQR) => {
    try {
      // Buscar todos os bilhetes e procurar o código QR
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bilhetes`);
      const bilhetes = await res.json();

      const bilhete = bilhetes.find((b) => b.codigo_qr === codigoQR);

      if (!bilhete) {
        setEstado("error");
        setMensagem("Bilhete não encontrado ou inválido.");
        return;
      }

      if (bilhete.estado_bilhete === "usado") {
        setEstado("error");
        setMensagem("Este bilhete já foi utilizado.");
        setResultado(bilhete);
        return;
      }

      if (bilhete.estado_bilhete === "cancelado") {
        setEstado("error");
        setMensagem("Este bilhete foi cancelado.");
        setResultado(bilhete);
        return;
      }

      // Marcar bilhete como usado
      await fetch(`${import.meta.env.VITE_API_URL}/api/bilhetes/${bilhete.id_bilhete}/usar`, {
        method: "PUT",
      });

      setEstado("success");
      setMensagem("Bilhete válido! Entrada autorizada.");
      setResultado(bilhete);

    } catch (err) {
      setEstado("error");
      setMensagem("Erro ao validar o bilhete. Tenta novamente.");
    }
  };

  const reiniciar = () => {
    setEstado("idle");
    setResultado(null);
    setMensagem("");
  };

  return (
    <div className="min-h-screen bg-gray-950 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-indigo-950 text-white flex justify-between items-center px-6 py-4 sticky top-0 z-50 border-b border-indigo-900">
        <Link to="/admin" className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm">
          <ChevronLeft className="w-4 h-4" /> Painel Admin
        </Link>
        <span className="font-bold text-sm">Leitor de Bilhetes</span>
        <div className="w-20" />
      </nav>

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 gap-6">

        {/* Estado: IDLE */}
        {estado === "idle" && (
          <div className="flex flex-col items-center gap-6 w-full max-w-sm">
            <div className="w-24 h-24 bg-indigo-900 rounded-full flex items-center justify-center">
              <QrCode className="w-12 h-12 text-indigo-300" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-white mb-2">Validar Bilhete</h1>
              <p className="text-gray-400 text-sm">Aponta a câmara para o QR Code do bilhete do utilizador.</p>
            </div>
            <button
              onClick={iniciarScanner}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-900/50"
            >
              Abrir Câmara
            </button>
          </div>
        )}

        {/* Scanner ativo */}
        {estado === "scanning" && (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <p className="text-white font-bold text-sm">A ler QR Code...</p>
            <div
              id="qr-reader"
              className="w-full rounded-2xl overflow-hidden border-2 border-indigo-500"
              style={{ minHeight: "300px" }}
            />
            <button
              onClick={pararScanner}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl transition-all text-sm"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Loading */}
        {estado === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-bold">A validar bilhete...</p>
          </div>
        )}

        {/* Sucesso */}
        {estado === "success" && (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-900/50">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-green-400 mb-1">Bilhete Válido!</h2>
              <p className="text-gray-400 text-sm">{mensagem}</p>
            </div>

            {resultado && (
              <div className="w-full bg-gray-900 rounded-2xl p-5 border border-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Evento</p>
                    <p className="text-white font-bold">{resultado.titulo_evento || `#${resultado.id_evento}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Utilizador</p>
                    <p className="text-white font-bold">{resultado.nome_utilizador || `#${resultado.id_utilizador}`}</p>
                  </div>
                </div>
                {resultado.data_hora && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Data</p>
                      <p className="text-white font-bold">
                        {new Date(resultado.data_hora).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-800">
                  <p className="text-xs text-gray-600 font-mono break-all">{resultado.codigo_qr}</p>
                </div>
              </div>
            )}

            <button onClick={reiniciar} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all active:scale-95">
              Ler Próximo Bilhete
            </button>
          </div>
        )}

        {/* Erro */}
        {estado === "error" && (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-red-400 mb-1">Inválido</h2>
              <p className="text-gray-400 text-sm">{mensagem}</p>
            </div>

            {resultado && (
              <div className="w-full bg-gray-900 rounded-2xl p-5 border border-red-900 space-y-2">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Código</p>
                <p className="text-white font-mono text-sm break-all">{resultado.codigo_qr}</p>
                <p className="text-xs text-red-400 font-bold capitalize">Estado: {resultado.estado_bilhete}</p>
              </div>
            )}

            <button onClick={reiniciar} className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl transition-all active:scale-95">
              Tentar Novamente
            </button>
          </div>
        )}
      </main>
    </div>
  );
}