import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/diary", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM diary ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar entradas");
  }
});

app.post("/api/diary", async (req, res) => {
  const { date, tags, observacoes, condicoes_percebidas, photoUrl } = req.body; 
  try {
    await pool.query(
      "INSERT INTO diary (date, tags, observacoes, condicoes_percebidas, photo_url) VALUES ($1, $2, $3, $4, $5)",
      [date, tags, observacoes, condicoes_percebidas, photoUrl]
    );
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao criar entrada");
  }
});

app.put("/api/diary/:id", async (req, res) => {
  const { id } = req.params;
  const { date, tags, observacoes, condicoes_percebidas, photoUrl } = req.body;
  try {
    await pool.query(
      "UPDATE diary SET date=$1, tags=$2, observacoes=$3, condicoes_percebidas=$4, photo_url=$5 WHERE id=$6",
      [date, tags, observacoes, condicoes_percebidas, photoUrl, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao atualizar entrada");
  }
});

app.delete("/api/diary/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM diary WHERE id=$1", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar entrada");
  }
});

app.post("/api/import-lots", async (req, res) => {
  console.log("Requisição recebida:", req.body); 

  const lots = Array.isArray(req.body) ? req.body : [req.body];
  console.log("Lotes processados:", lots); 

  const results = [];
  for (const lot of lots) {
    try {
      if (!lot.date || !lot.tags || !lot.observacoes || !lot.condicoes_percebidas) {
        console.error("Lote inválido:", lot); 
        throw new Error("Dados do lote incompletos");
      }

      const { date, tags, observacoes, condicoes_percebidas, photoUrl } = lot;
      const normalizedLot = {
        date,
        tags: tags.trim().toLowerCase(),
        observacoes: observacoes.trim().toLowerCase(),
        condicoes_percebidas: condicoes_percebidas.trim().toLowerCase(),
        photoUrl: photoUrl ? photoUrl.trim() : null,
      };
      console.log("Lote normalizado:", normalizedLot); 

      const result = await pool.query(
        `INSERT INTO diary (date, tags, observacoes, condicoes_percebidas, photo_url)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (date, tags, observacoes, condicoes_percebidas, photo_url) DO NOTHING
         RETURNING id`,
        [
          normalizedLot.date,
          normalizedLot.tags,
          normalizedLot.observacoes,
          normalizedLot.condicoes_percebidas,
          normalizedLot.photoUrl,
        ]
      );
      console.log("Resultado da inserção no banco:", result.rows); 
      if (result.rows.length > 0) {
        console.log("Registro inserido com sucesso:", result.rows[0]); 
        results.push({ lot: normalizedLot, status: "success", id: result.rows[0].id });
      } else {
        console.log("Registro ignorado (duplicado):", normalizedLot); 
        results.push({ lot: normalizedLot, status: "ignored", message: "Registro já existe no banco de dados" });
      }
    } catch (error) {
      console.error("Erro ao processar lote:", lot, error.message); 
      results.push({ lot, status: "error", message: error.message });
    }
  }

  console.log("Resultados finais:", results);
  res.status(200).json(results);
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000 🚀"));