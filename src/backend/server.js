const express = require("express");
const cors = require("cors");
require("dotenv").config();

const utilizadoresRoutes = require("./routes/utilizadores");
const eventosRoutes = require("./routes/eventos");
const bilhetesRoutes = require("./routes/bilhetes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/utilizadores", utilizadoresRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/bilhetes", bilhetesRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ mensagem: "API a funcionar! 🚀" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});
