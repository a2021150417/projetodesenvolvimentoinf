const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { enviarRecuperacaoPassword } = require("../email");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/fotos";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `user_${req.params.id}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });


router.get("/admin/stats", async (req, res) => {
  try {
    const bilhetesRes = await pool.query("SELECT COUNT(*) FROM bilhetes");
    const receitaRes = await pool.query(`
      SELECT COALESCE(SUM(e.preco), 0) as total 
      FROM bilhetes b 
      JOIN eventos e ON b.id_evento = e.id_evento
    `);

    const stats = {
      bilhetes_vendidos: parseInt(bilhetesRes.rows[0].count) || 0,
      receita_total: parseFloat(receitaRes.rows[0].total) || 0
    };

    console.log("Stats Admin carregadas com sucesso:", stats);
    res.json(stats);
  } catch (err) {
    console.error("ERRO NAS STATS ADMIN:", err.message);
    res.status(500).json({ erro: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT id_utilizador, nome, email, is_admin, foto_perfil FROM Utilizador ORDER BY id_utilizador ASC"
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post("/registo", async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    const userExiste = await pool.query("SELECT * FROM Utilizador WHERE email = $1", [email]);
    if (userExiste.rows.length > 0) return res.status(400).json({ erro: "Este email já está registado." });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const isAdmin = email === "admin@quickpass.pt";
    const novoUser = await pool.query(
      "INSERT INTO Utilizador (nome, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id_utilizador, nome, email, is_admin",
      [nome, email, hashPassword, isAdmin]
    );
    res.status(201).json({ mensagem: "Conta criada com sucesso!", utilizador: novoUser.rows[0] });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

// POST /api/utilizadores/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const resultado = await pool.query("SELECT * FROM Utilizador WHERE email = $1", [email]);
    if (resultado.rows.length === 0) return res.status(401).json({ erro: "Email ou palavra-passe incorretos." });
    const utilizador = resultado.rows[0];
    const passwordValida = await bcrypt.compare(password, utilizador.password);
    if (!passwordValida) return res.status(401).json({ erro: "Email ou palavra-passe incorretos." });
    const token = jwt.sign({ id: utilizador.id_utilizador, email: utilizador.email }, process.env.JWT_SECRET || "segredo", { expiresIn: "24h" });
    res.json({ token, utilizador: { id_utilizador: utilizador.id_utilizador, nome: utilizador.nome, email: utilizador.email, is_admin: utilizador.is_admin } });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});


router.get("/:id/stats", async (req, res) => {
  try {
    const { id } = req.params;
    const bilhetes = await pool.query("SELECT COUNT(*) FROM bilhetes WHERE id_utilizador = $1", [id]);
    const utilizador = await pool.query("SELECT data_registo FROM utilizador WHERE id_utilizador = $1", [id]);
    res.json({ 
        eventos_assistidos: parseInt(bilhetes.rows[0].count) || 0, 
        membro_desde: utilizador.rows[0]?.data_registo ? new Date(utilizador.rows[0].data_registo).getFullYear() : 2024,
        favoritos_guardados: 0 
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/utilizadores/:id (Obter perfil)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query("SELECT id_utilizador, nome, email, is_admin, foto_perfil, data_registo FROM Utilizador WHERE id_utilizador = $1", [id]);
    if (resultado.rows.length === 0) return res.status(404).json({ erro: "Utilizador não encontrado" });
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT /api/utilizadores/:id (Atualizar)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, foto_perfil } = req.body;
    const resultado = await pool.query("UPDATE Utilizador SET nome=$1, email=$2, foto_perfil=$3 WHERE id_utilizador=$4 RETURNING *", [nome, email, foto_perfil, id]);
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Utilizador WHERE id_utilizador = $1", [req.params.id]);
    res.json({ mensagem: "Utilizador apagado" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;