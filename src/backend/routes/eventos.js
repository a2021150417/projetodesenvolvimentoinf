const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/eventos — listar todos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM Eventos ORDER BY data_hora ASC"
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/eventos/:id — obter um evento
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      "SELECT * FROM Eventos WHERE id_evento = $1",
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Evento não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /api/eventos — criar evento
router.post("/", async (req, res) => {
  try {
    const { titulo, descricao, data_hora, preco, stock_disponivel } = req.body;
    const resultado = await pool.query(
      "INSERT INTO Eventos (titulo, descricao, data_hora, preco, stock_disponivel) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [titulo, descricao, data_hora, preco, stock_disponivel]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// PUT /api/eventos/:id — atualizar evento
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, data_hora, preco, stock_disponivel } = req.body;
    const resultado = await pool.query(
      "UPDATE Eventos SET titulo=$1, descricao=$2, data_hora=$3, preco=$4, stock_disponivel=$5 WHERE id_evento=$6 RETURNING *",
      [titulo, descricao, data_hora, preco, stock_disponivel, id]
    );
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE /api/eventos/:id — apagar evento
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Eventos WHERE id_evento = $1", [id]);
    res.json({ mensagem: "Evento apagado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
