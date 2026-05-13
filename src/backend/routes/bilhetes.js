const express = require("express");
const router = express.Router();
const pool = require("../db");
const { enviarBilhete } = require("../email");

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

router.get("/utilizador/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(`
      SELECT b.id_bilhete, b.id_utilizador, b.id_evento, b.codigo_qr, b.estado_bilhete, b.data_compra,
             e.titulo AS titulo_evento, e.data_hora, e.preco
      FROM Bilhetes b
      LEFT JOIN Eventos e ON b.id_evento = e.id_evento
      WHERE b.id_utilizador = $1
      ORDER BY b.data_compra DESC
    `, [id]);
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_utilizador, id_evento, email, nome } = req.body;

    await client.query("BEGIN");

    const evento = await client.query(
      "SELECT stock_disponivel FROM Eventos WHERE id_evento = $1 FOR UPDATE",
      [id_evento]
    );

    if (evento.rows.length === 0) throw new Error("Evento não encontrado");
    if (evento.rows[0].stock_disponivel <= 0) throw new Error("Sem bilhetes disponíveis");

   
    const identificador = id_utilizador
      ? `U${id_utilizador}`
      : email
      ? email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
      : "GUEST";
    const codigo_qr = `QPEV${id_evento}${identificador}TS${Date.now()}`;

    const bilhete = await client.query(
      "INSERT INTO Bilhetes (id_utilizador, id_evento, codigo_qr, estado_bilhete) VALUES ($1, $2, $3, 2) RETURNING *",
      [id_utilizador || null, id_evento, codigo_qr]
    );

    await client.query(
      "UPDATE Eventos SET stock_disponivel = stock_disponivel - 1 WHERE id_evento = $1",
      [id_evento]
    );

    await client.query("COMMIT");

    try {
      const eventoInfo = await pool.query(
        "SELECT titulo, data_hora, morada, preco FROM Eventos WHERE id_evento = $1",
        [id_evento]
      );
      if (email && eventoInfo.rows.length > 0) {
        const e = eventoInfo.rows[0];
        enviarBilhete({
          para: email,
          nome: nome || "Utilizador",
          evento: e.titulo,
          data: e.data_hora
            ? new Date(e.data_hora).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })
            : null,
          local: e.morada || null,
          codigoQR: bilhete.rows[0].codigo_qr,
          preco: e.preco ? `${Number(e.preco).toFixed(2)}` : null,
        }).catch(() => {});
      }
    } catch {}

    res.status(201).json(bilhete.rows[0]);

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(400).json({ erro: err.message });
  } finally {
    client.release();
  }
});

router.put("/validar/:codigo_qr", async (req, res) => {
  try {
    const { codigo_qr } = req.params;

    const bilheteAtual = await pool.query(
      "SELECT * FROM Bilhetes WHERE codigo_qr = $1",
      [codigo_qr]
    );

    if (bilheteAtual.rows.length === 0) {
      return res.status(404).json({ erro: "Bilhete não encontrado. QR Code inválido." });
    }

    const bilhete = bilheteAtual.rows[0];

    if (bilhete.estado_bilhete === 1) {
      return res.status(400).json({ erro: "Este bilhete já foi utilizado anteriormente." });
    }

    if (bilhete.estado_bilhete !== 2 && bilhete.estado_bilhete !== null) {
      return res.status(400).json({ erro: "Bilhete em estado inválido." });
    }

    const resultado = await pool.query(
      "UPDATE Bilhetes SET estado_bilhete = 1 WHERE codigo_qr = $1 AND (estado_bilhete = 2 OR estado_bilhete IS NULL) RETURNING *",
      [codigo_qr]
    );

    res.json({
      mensagem: "Bilhete validado com sucesso! Entrada permitida.",
      bilhete: resultado.rows[0],
    });
  } catch (err) {
    console.error("Erro ao validar bilhete:", err.message);
    res.status(500).json({ erro: "Erro interno ao processar a validação." });
  }
});

router.put("/:id/usar", async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      "UPDATE Bilhetes SET estado_bilhete = 1 WHERE id_bilhete = $1 RETURNING *",
      [id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: "Bilhete não encontrado" });
    }
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

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