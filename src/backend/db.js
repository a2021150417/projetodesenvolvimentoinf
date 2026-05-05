const { Pool } = require("pg");
require("dotenv").config();

// Criamos um objeto de configuração apenas com os campos obrigatórios
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
};

// Se a password existir no .env (e não estiver vazia), nós adicionamo-la.
// Se não existir, o Node não tenta enviar uma password vazia à BD.
if (process.env.DB_PASSWORD && process.env.DB_PASSWORD.trim() !== "") {
  config.password = process.env.DB_PASSWORD;
}

const pool = new Pool(config);

// Forçar encoding UTF8 em cada nova ligação para evitar problemas com acentos
pool.on("connect", (client) => {
  client.query("SET client_encoding = 'UTF8'");
});

// Testar a ligação logo ao arrancar
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Erro fatal ao ligar à base de dados:", err.message);
  } else {
    console.log("✅ Ligado ao PostgreSQL com sucesso!");
    release(); // É importante libertar o cliente após o teste
  }
});

module.exports = pool;