const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Adiciona este middleware para o UTF-8
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Importar e usar rotas (apenas uma vez cada)
const rotasUtilizadores = require("./routes/utilizadores");
const rotasEventos = require("./routes/eventos");
const rotasBilhetes = require("./routes/bilhetes");
const rotasComentarios = require("./routes/comentarios");

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