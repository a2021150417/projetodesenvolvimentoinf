import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from './FavoritesContext';
import { CartProvider } from './CartContext'; 

import Home from './Home';
import Eventos from './Eventos';
import EventDetalhes from './EventDetalhes';
import Login from './Login';
import Registo from './Registo';
import Suporte from './Suporte'; 
import Chatbot from './Chatbot';
import Carrinho from './Carrinho'; 

function App() {
  return (
    <Router>
      <FavoritesProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registo" element={<Registo />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:id" element={<EventDetalhes />} />
            <Route path="/suporte" element={<Suporte />} />
            <Route path="/carrinho" element={<Carrinho />} />
          </Routes>
          <Chatbot />
        </CartProvider>
      </FavoritesProvider>
    </Router>
  );
}

export default App;