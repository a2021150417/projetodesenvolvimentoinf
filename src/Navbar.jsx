import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

function getUserFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch { return null; }
}

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Utilizador";
  const user = getUserFromToken();
  const { cart } = useCart();
  const [fotoPerfil, setFotoPerfil] = useState(
    localStorage.getItem("userFoto") || null
  );

  useEffect(() => {
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/utilizadores/${user.id}`)
      .then((r) => r.json())
      .then((dados) => {
        if (dados.foto_perfil) {
          setFotoPerfil(dados.foto_perfil);
          localStorage.setItem("userFoto", dados.foto_perfil);
        }
      })
      .catch(() => {});
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userFoto");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/10 shadow-sm flex justify-between items-center px-8 py-4 text-white">
      <Link to="/" className="text-xl font-bold flex items-center gap-2">
        <span className="bg-white text-black p-1 rounded text-sm">QP</span> QuickPass
      </Link>

      <div className="flex gap-5 items-center font-medium">
        <Link to="/carrinho" className="relative flex items-center text-white hover:text-gray-300 transition-colors">
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
        {token ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              {fotoPerfil ? (
                <img
                  src={fotoPerfil}
                  alt="Perfil"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white/30 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-gray-300">
                Bem-vindo, <span className="text-white font-bold">{userName}</span>
              </span>
            </button>
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
  );
}