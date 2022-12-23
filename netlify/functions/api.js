const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const { Pool } = require("pg");
const { red } = require("@mui/material/colors");

const pool = new Pool({
  host: process.env.REACT_APP_PGHOST,
  user: process.env.REACT_APP_PGUSER,
  database: process.env.REACT_APP_PGDATABASE,
  port: 5432,
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

router.get("/papers/:abstract/:abstract2/:abstract3/:startYear/:endYear", async function (req, res) {
  const data = await selectRows(`SELECT * FROM papers WHERE (publication_year BETWEEN $4 and $5) 
    AND ((abstract ILIKE $1 AND abstract ILIKE $2 
    AND abstract ILIKE $3) OR (title ILIKE $1 AND title ILIKE $2 AND title ILIKE $3) OR (authors ILIKE 
    $1 AND authors ILIKE $2 AND authors ILIKE $3))  LIMIT 20000`,[
    req.params.abstract,
    req.params.abstract2,
    req.params.abstract3,
    req.params.startYear,
    req.params.endYear,
  ]);
  res.json(data);  
  // if (data.length === 0) {
  //   res.status(404).json({ message: "not found" });
  // } else {
  //   res.json(data);
  // }
});

router.get("/authors", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authors`);
  res.json(data);
});

router.get("/authors/:doi", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authors WHERE doi = $1`, [
    req.params.doi,
  ]);
  if (data.length === 0) {
    res.status(404).json({ message: "not found" });
  } else {
    res.json(data);
  }
});

router.get("/authors/:name/:name2/:name3/:name4/:name5", async function (req, res) {
  const data = await selectRows(`SELECT * FROM authors WHERE name ILIKE $1 AND name ILIKE $2 
  AND name ILIKE $3 AND name ILIKE $4 AND name ILIKE $5 LIMIT 20000`,[
    req.params.name,
    req.params.name2,
    req.params.name3,
    req.params.name4,
    req.params.name5,
  ]); 
  res.json(data); 
  // if (data.length === 0) {
  //   res.status(404).json({ message: "not found" });
  // } else {
  //   res.json(data);
  // }
});

//router.get("/authors/:name", async (req, res) => {
//    const data = await selectRows(`SELECT * FROM authors WHERE name &@ $1`,[
//      req.params.name,
//    ]);  
//    if (data.length === 0) {
//      res.status(404).json({ message: "not found" });
//    } else {
//      res.json(data);
//    }
//});



router.get("/journals", async (req, res) => {
  const data = await selectRows(`SELECT * FROM journals`);
  res.json(data);
});





 router.get("/authors/:doi", async (req, res) => {
  const data = await selectRows(`SELECT * FROM authors WHERE doi = $1`, [
    req.params.doi,
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
    const data = await selectRows(`SELECT * FROM keywords WHERE keyword = $1 AND (year BETWEEN $2 and $3)`, [
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