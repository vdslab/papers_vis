const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.REACT_APP_PGHOST,
  user: process.env.REACT_APP_PGUSER,
  database: process.env.REACT_APP_PGDATABASE,
  port: 5433,
  password: process.env.REACT_APP_PGPASSWORD,
  connectionTimeoutMillis: 60000,
  statement_timeout: 60000
});

async function selectRows(sql, values = []) {
    const client = await pool.connect();
    try {
      const res = await client.query({text:sql, values:values, timeout: 60000});
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

// router.get("/papers/:abstract", async function (req, res) {
//   const data = await selectRows(`SELECT * FROM papers WHERE abstract &@ $1`,[
//     req.params.abstract,
//   ]);  
//   if (data.length === 0) {
//     res.status(404).json({ message: "not found" });
//   } else {
//     res.json(data);
//   }
// });


router.get("/papers/doi/:doi", async function (req, res) {
  const data = await selectRows(`SELECT * FROM papers WHERE doi = $1`,[
    req.params.doi,
  ]);  
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
});

router.get("/papers/:abstract", async function (req, res) {
  const data = await selectRows(`SELECT * FROM papers WHERE abstract ILIKE $1 LIMIT 20000`,[
    req.params.abstract,
  ]);  
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
});

router.get("/authors", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authors`);
  res.json(data);
});

router.get("/authors/:name", async (req, res) => {
    const data = await selectRows(`SELECT * FROM authors WHERE name &@ $1`,[
      req.params.name,
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




// router.get("/authors/:doi", async (req, res) => {
//   const data = await selectRows(`SELECT * FROM authors WHERE doi = $1`, [
//     req.params.doi,
//   ]);
//   if (data.length === 0) {
//     res.status(404).json({ message: "not found" });
//   } else {
//     res.json(data);
//   }
// });

router.get("/keywords", async (req, res) => {
  const data = await selectRows(`SELECT * FROM keywords`);
  res.json(data);
});

router.get("/keywords/:doi", async(req, res) => {
  const data = await selectRows(`SELECT * FROM keywords WHERE doi = $1`, [
    req.params.doi,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
}); 

router.get("/keywords/:keyword/:startYear/:endYear", async (req, res) => {
    const data = await selectRows(`SELECT * FROM keywords WHERE keyword = $1 AND year >= $2 AND year <= $3`, [
      req.params.keyword,
      req.params.startYear,
      req.params.endYear
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

router.get("/authorsearch", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authorsearch`);
  res.json(data);
});

router.get("/authorsearch/:doi", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authorsearch WHERE doi = $1`, [
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
