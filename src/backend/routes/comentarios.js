const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM Comentarios ORDER BY data_comentario DESC"
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id_utilizador, nome, comentario, estrelas } = req.body;
    if (!nome || !comentario || !estrelas) {
      return res.status(400).json({ erro: "Nome, comentário e estrelas são obrigatórios." });
    }
    const resultado = await pool.query(
      "INSERT INTO Comentarios (id_utilizador, nome, comentario, estrelas) VALUES ($1, $2, $3, $4) RETURNING *",
      [id_utilizador || null, nome, comentario, estrelas]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
