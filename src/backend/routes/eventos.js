const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. LISTAR EVENTOS
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    let resultado;
    if (search && search.trim() !== "") {
      resultado = await pool.query(
        `SELECT * FROM Eventos 
         WHERE titulo ILIKE $1 
            OR categoria ILIKE $1 
            OR distrito ILIKE $1
         ORDER BY data_hora ASC`,
        [`%${search.trim()}%`]
      );
    } else {
      resultado = await pool.query(
        "SELECT * FROM Eventos ORDER BY data_hora ASC"
      );
    }
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// 2. BUSCAR UM EVENTO POR ID
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

// 3. CRIAR NOVO EVENTO
router.post("/", async (req, res) => {
  try {
    const { titulo, subtitulo, descricao, data_hora, preco, stock_disponivel, categoria, local_evento, distrito, foto_evento, hora_portas, hora_inicio } = req.body;
    const resultado = await pool.query(
      `INSERT INTO Eventos (titulo, subtitulo, descricao, data_hora, preco, stock_disponivel, categoria, local_evento, distrito, foto_evento, hora_portas, hora_inicio) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [titulo, subtitulo || "", descricao, data_hora, preco, stock_disponivel, categoria, local_evento, distrito, foto_evento, hora_portas || null, hora_inicio || null]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// 4. ATUALIZAR EVENTO EXISTENTE
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, subtitulo, descricao, data_hora, preco, stock_disponivel, categoria, local_evento, distrito, foto_evento, hora_portas, hora_inicio } = req.body;

    const resultado = await pool.query(
      `UPDATE Eventos SET 
        titulo=$1, subtitulo=$2, descricao=$3, data_hora=$4, preco=$5, 
        stock_disponivel=$6, categoria=$7, local_evento=$8, distrito=$9, foto_evento=$10,
        hora_portas=$11, hora_inicio=$12
       WHERE id_evento=$13 RETURNING *`,
      [titulo, subtitulo || "", descricao, data_hora, preco, stock_disponivel, categoria, local_evento, distrito, foto_evento, hora_portas || null, hora_inicio || null, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: "Evento não encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error("Erro na atualização:", err);
    res.status(500).json({ erro: err.message });
  }
});

// 5. ELIMINAR EVENTO
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