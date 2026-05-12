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

// POST /api/utilizadores/registo
router.post("/registo", async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    const userExiste = await pool.query("SELECT * FROM Utilizador WHERE email = $1", [email]);
    if (userExiste.rows.length > 0) {
      return res.status(400).json({ erro: "Este email já está registado." });
    }
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
    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Email ou palavra-passe incorretos." });
    }
    const utilizador = resultado.rows[0];
    const passwordValida = await bcrypt.compare(password, utilizador.password);
    if (!passwordValida) {
      return res.status(401).json({ erro: "Email ou palavra-passe incorretos." });
    }
    const tokenSecret = process.env.JWT_SECRET || "quickpass_segredo_temporario";
    const token = jwt.sign(
      { id: utilizador.id_utilizador, email: utilizador.email },
      tokenSecret,
      { expiresIn: "24h" }
    );
    res.json({
      token,
      utilizador: {
        id_utilizador: utilizador.id_utilizador,
        nome: utilizador.nome,
        email: utilizador.email,
        is_admin: utilizador.is_admin
      },
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

// GET /api/utilizadores — listar todos
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

// GET /api/utilizadores/:id — obter um utilizador
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      "SELECT id_utilizador, nome, email, is_admin, foto_perfil FROM Utilizador WHERE id_utilizador = $1",
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

// GET /api/utilizadores/:id/stats — estatísticas do utilizador
router.get("/:id/stats", async (req, res) => {
  try {
    const { id } = req.params;

    // Contar bilhetes (eventos assistidos)
    const bilhetes = await pool.query(
      "SELECT COUNT(*) FROM Bilhetes WHERE id_utilizador = $1",
      [id]
    );

    // Data de criação da conta (usando MIN data_comentario como aproximação, ou hoje se não existir)
    const utilizador = await pool.query(
      "SELECT created_at FROM Utilizador WHERE id_utilizador = $1",
      [id]
    );

    const eventos_assistidos = parseInt(bilhetes.rows[0].count) || 0;
    const membro_desde = utilizador.rows[0]?.created_at ? new Date(utilizador.rows[0].created_at).getFullYear() : new Date().getFullYear();

    res.json({
      eventos_assistidos,
      favoritos_guardados: 0, // Will be handled by frontend localStorage
      membro_desde,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT /api/utilizadores/:id — atualizar utilizador
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, foto_perfil } = req.body;
    const resultado = await pool.query(
      "UPDATE Utilizador SET nome=$1, email=$2, foto_perfil=$3 WHERE id_utilizador=$4 RETURNING id_utilizador, nome, email, is_admin, foto_perfil",
      [nome, email, foto_perfil, id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /api/utilizadores/:id/foto — upload foto
router.post("/:id/foto", upload.single("foto"), async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) return res.status(400).json({ erro: "Nenhuma imagem enviada" });
    const fotoUrl = `${process.env.VITE_API_URL || "http://localhost:3001"}/uploads/fotos/${req.file.filename}`;
    await pool.query("UPDATE Utilizador SET foto_perfil = $1 WHERE id_utilizador = $2", [fotoUrl, id]);
    res.json({ foto_perfil: fotoUrl });
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

// POST /api/utilizadores/recuperar-password
router.post("/recuperar-password", async (req, res) => {
  try {
    const { email } = req.body;
    const resultado = await pool.query("SELECT * FROM Utilizador WHERE email = $1", [email]);
    if (resultado.rows.length === 0) {
      return res.json({ mensagem: "Se o email existir, receberás um link em breve." });
    }
    const utilizador = resultado.rows[0];
    const token = crypto.randomBytes(32).toString("hex");
    const expira = new Date(Date.now() + 3600000); // 1 hora
    await pool.query(
      "UPDATE Utilizador SET reset_token = $1, reset_token_expira = $2 WHERE id_utilizador = $3",
      [token, expira, utilizador.id_utilizador]
    );
    enviarRecuperacaoPassword({ para: email, nome: utilizador.nome, token }).catch(err => console.error("Erro ao enviar email:", err));
    res.json({ mensagem: "Se o email existir, receberás um link em breve." });
  } catch (err) {
    console.error("Erro recuperar-password:", err.message);
    res.status(500).json({ erro: "Erro ao processar pedido." });
  }
});

// POST /api/utilizadores/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, novaPassword } = req.body;
    const resultado = await pool.query(
      "SELECT * FROM Utilizador WHERE reset_token = $1 AND reset_token_expira > NOW()",
      [token]
    );
    if (resultado.rows.length === 0) {
      return res.status(400).json({ erro: "Link inválido ou expirado." });
    }
    const utilizador = resultado.rows[0];
    const hash = await bcrypt.hash(novaPassword, 10);
    await pool.query(
      "UPDATE Utilizador SET password = $1, reset_token = NULL, reset_token_expira = NULL WHERE id_utilizador = $2",
      [hash, utilizador.id_utilizador]
    );
    res.json({ mensagem: "Palavra-passe alterada com sucesso!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao redefinir palavra-passe." });
  }
});

module.exports = router;