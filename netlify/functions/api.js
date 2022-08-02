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

router.get("/papers/:keywords", async (req, res) => {
  const data = await selectRows(`SELECT * FROM papers WHERE keywords LIKE $%system%`,[
    req.params.keywords,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data[0]);
  }
  res.json(data);
});

router.get("/journals", async (req, res) => {
    const data = await selectRows(`SELECT * FROM journals`);
    res.json(data);
});

router.get("/journals/:", async (req, res) => {
  const data = await selectRows(`SELECT * FROM papers WHERE  LIKE $1 %Computing%`,[
    req.params.keywords,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data[0]);
  }
  res.json(data);
});

router.get("/authors", async (req, res) => {
    const data = await selectRows(`SELECT * FROM authors`);
    res.json(data);
});

const app = express();
app.use(cors());
app.use("/.netlify/functions/api", router);

exports.handler = serverless(app);
