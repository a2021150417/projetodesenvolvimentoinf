const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/bilhetes — listar todos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT b.*, u.nome AS nome_utilizador, e.titulo AS titulo_evento
      FROM Bilhetes b
      JOIN Utilizador u ON b.id_utilizador = u.id_utilizador
      JOIN Eventos e ON b.id_evento = e.id_evento
      ORDER BY b.data_compra DESC
    `);
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// GET /api/bilhetes/utilizador/:id — bilhetes de um utilizador
router.get("/utilizador/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`
      SELECT b.*, e.titulo AS titulo_evento, e.data_hora, e.preco
      FROM Bilhetes b
      JOIN Eventos e ON b.id_evento = e.id_evento
      WHERE b.id_utilizador = $1
      ORDER BY b.data_compra DESC
    `, [id]);
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// POST /api/bilhetes — comprar bilhete
router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_utilizador, id_evento } = req.body;

    await client.query("BEGIN");

    // Verificar stock disponível
    const evento = await client.query(
      "SELECT stock_disponivel FROM Eventos WHERE id_evento = $1 FOR UPDATE",
      [id_evento]
    );

    if (evento.rows.length === 0) {
      throw new Error("Evento não encontrado");
    }

    if (evento.rows[0].stock_disponivel <= 0) {
      throw new Error("Sem bilhetes disponíveis");
    }

    // Gerar código QR simples
    const codigo_qr = `QR-${id_evento}-${id_utilizador}-${Date.now()}`;

    // Criar bilhete
    const bilhete = await client.query(
      "INSERT INTO Bilhetes (id_utilizador, id_evento, codigo_qr) VALUES ($1, $2, $3) RETURNING *",
      [id_utilizador, id_evento, codigo_qr]
    );

    // Decrementar stock
    await client.query(
      "UPDATE Eventos SET stock_disponivel = stock_disponivel - 1 WHERE id_evento = $1",
      [id_evento]
    );

    await client.query("COMMIT");
    res.status(201).json(bilhete.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ erro: err.message });
  } finally {
    client.release();
  }
});

// DELETE /api/bilhetes/:id — cancelar bilhete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Bilhetes WHERE id_bilhete = $1", [id]);
    res.json({ mensagem: "Bilhete cancelado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
