const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
const utilizadorRoutes = require("./routes/utilizadores");
app.use("/api/utilizadores", utilizadorRoutes);

// Importar rotas
const rotasUtilizadores = require("./routes/utilizadores");
const rotasEventos = require("./routes/eventos");
const rotasBilhetes = require("./routes/bilhetes");
const rotasComentarios = require("./routes/comentarios");

// Usar rotas
app.use("/api/utilizadores", rotasUtilizadores);
app.use("/api/eventos", rotasEventos);
app.use("/api/bilhetes", rotasBilhetes);
app.use("/api/comentarios", rotasComentarios);

// Rota de teste
app.get("/", (req, res) => {
  res.json({ mensagem: "API a funcionar!" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor a correr na porta " + PORT);
});