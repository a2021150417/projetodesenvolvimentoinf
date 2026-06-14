const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

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