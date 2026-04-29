const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "quickpass_secret";

// POST /api/utilizadores/registo — criar conta
router.post("/registo", async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    // Verificar se o email já existe
    const existe = await pool.query(
      "SELECT id_utilizador FROM Utilizador WHERE email = $1",
      [email]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ erro: "Este email já está registado" });
    }

    // Encriptar a password
    const hash = await bcrypt.hash(password, 10);

    // Criar utilizador
    const resultado = await pool.query(
      "INSERT INTO Utilizador (nome, email, password) VALUES ($1, $2, $3) RETURNING id_utilizador, nome, email",
      [nome, email, hash]
    );

    res.status(201).json({ mensagem: "Conta criada com sucesso!", utilizador: resultado.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /api/utilizadores/login — fazer login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se o utilizador existe
    const resultado = await pool.query(
      "SELECT * FROM Utilizador WHERE email = $1",
      [email]
    );
    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Email ou password incorretos" });
    }

    const utilizador = resultado.rows[0];

    // Verificar a password
    const passwordCorreta = await bcrypt.compare(password, utilizador.password);
    if (!passwordCorreta) {
      return res.status(401).json({ erro: "Email ou password incorretos" });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: utilizador.id_utilizador, email: utilizador.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      utilizador: {
        id_utilizador: utilizador.id_utilizador,
        nome: utilizador.nome,
        email: utilizador.email,
      },
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/utilizadores — listar todos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id_utilizador, nome, email, data_nascimento FROM Utilizador"
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/utilizadores/:id — obter um utilizador
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      "SELECT id_utilizador, nome, email, data_nascimento FROM Utilizador WHERE id_utilizador = $1",
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Utilizador não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT /api/utilizadores/:id — atualizar utilizador
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, data_nascimento } = req.body;
    const resultado = await pool.query(
      "UPDATE Utilizador SET nome=$1, email=$2, data_nascimento=$3 WHERE id_utilizador=$4 RETURNING id_utilizador, nome, email",
      [nome, email, data_nascimento, id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE /api/utilizadores/:id — apagar utilizador
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Utilizador WHERE id_utilizador = $1", [id]);
    res.json({ mensagem: "Utilizador apagado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;