const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.REACT_APP_PGHOST,
  user: process.env.REACT_APP_PGUSER,
  database: process.env.REACT_APP_PGDATABASE,
  port: 5432,
  password: process.env.REACT_APP_PGPASSWORD,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function selectRows(sql, values = []) {
    const client = await pool.connect();
    try {
      const res = await client.query(sql, values);
      return res.rows;
    } finally {
      client.release();
    }
}
  
const router = express.Router();

router.get("/papers", async (req, res) => {
  const data = await selectRows(`SELECT * FROM papers`);
  res.json(data);
});

router.get("/papers/:doi", async (req, res) => {
  const data = await selectRows(`SELECT * FROM papers WHERE doi = $1`, [
    req.params.doi,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
});


router.get("/journals", async (req, res) => {
  const data = await selectRows(`SELECT * FROM journals`);
  res.json(data);
});

router.get("/authors", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authors`);
  res.json(data);
});

router.get("/authors/:author_id", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authors WHERE author_id = $1`, [
    req.params.author_id,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
});

router.get("/keywords", async (req, res) => {
  const data = await selectRows(`SELECT * FROM keywords`);
  res.json(data);
});

router.get("/keywords/:keyword", async (req, res) => {
    const data = await selectRows(`SELECT * FROM keywords WHERE keyword = $1`, [
      req.params.keyword,
    ]);
    if (data.length === 0) {
      res.status(404).json({ message: "not found" });
    } else {
      res.json(data);
    }
});


router.get("/search", async (req, res) => {
  const data = await selectRows(`SELECT * FROM search`);
  res.json(data);
});

router.get("/search/:doi", async (req, res) => {
  const data = await selectRows(`SELECT * FROM search WHERE doi = $1`, [
    req.params.doi,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
});

router.get("/similarity", async (req, res) => {
  const data = await selectRows(`SELECT * FROM similarity`);
  res.json(data);
});

router.get("/similarity/:doi", async (req, res) => {
  const data = await selectRows(`SELECT * FROM similarity WHERE doi = $1`, [
    req.params.doi,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
});

const app = express();
app.use(cors());
app.use("/.netlify/functions/api", router);

exports.handler = serverless(app);
