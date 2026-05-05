const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // O caminho tem ".." para recuar para a pasta backend

// ==========================================
// ROTA 1: REGISTO (/api/utilizadores/registo)
// ==========================================
router.post("/registo", async (req, res) => {
  try {
    const { nome, email, password } = req.body;

    // 1. Verificar se o utilizador já existe na BD
    const userExiste = await pool.query("SELECT * FROM Utilizador WHERE email = $1", [email]);
    
    if (userExiste.rows.length > 0) {
      return res.status(400).json({ erro: "Este email já está registado." });
    }

    // 2. Encriptar a password para máxima segurança
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // 3. Truque: Se o email for o do admin, dá-lhe poderes! Se não, é utilizador normal.
    const isAdmin = email === "admin@quickpass.pt";

    // 4. Guardar na Base de Dados
    const novoUser = await pool.query(
      "INSERT INTO Utilizador (nome, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id_utilizador, nome, email, is_admin",
      [nome, email, hashPassword, isAdmin]
    );

    res.status(201).json({ 
      mensagem: "Conta criada com sucesso!", 
      utilizador: novoUser.rows[0] 
    });

  } catch (err) {
    console.error("Erro no registo:", err.message);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

// ==========================================
// ROTA 2: LOGIN (/api/utilizadores/login)
// ==========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Procurar o utilizador pelo email
    const resultado = await pool.query("SELECT * FROM Utilizador WHERE email = $1", [email]);
    
    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: "Email ou palavra-passe incorretos." });
    }

    const utilizador = resultado.rows[0];

    // 2. Verificar se a password bate certo com a da base de dados
    const passwordValida = await bcrypt.compare(password, utilizador.password);
    
    if (!passwordValida) {
      return res.status(401).json({ erro: "Email ou palavra-passe incorretos." });
    }

    // 3. Gerar o "bilhete de identidade" (Token)
    const tokenSecret = process.env.JWT_SECRET || "quickpass_segredo_temporario";
    const token = jwt.sign(
      { id: utilizador.id_utilizador, email: utilizador.email },
      tokenSecret,
      { expiresIn: "24h" }
    );

    // 4. Devolver os dados de sucesso ao site
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
    console.error("Erro no login:", err.message);
    res.status(500).json({ erro: "Erro interno do servidor." });
  }
});

module.exports = router;