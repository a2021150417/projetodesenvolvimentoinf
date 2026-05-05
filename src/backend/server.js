const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir imagens de perfil
app.use("/uploads", express.static("uploads"));

// Importar rotas
const rotasUtilizadores = require("./routes/utilizadores");
const rotasEventos = require("./routes/eventos");
const rotasBilhetes = require("./routes/bilhetes");

// Usar rotas
app.use("/api/utilizadores", rotasUtilizadores);
app.use("/api/eventos", rotasEventos);
app.use("/api/bilhetes", rotasBilhetes);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ mensagem: "API a funcionar!" });
});

// Arrancar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Servidor a correr na porta " + PORT);
});