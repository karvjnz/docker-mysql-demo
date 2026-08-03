const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "root123",
  database: "companydb",
});

db.connect((err) => {
  if (err) {
    console.log("DB Connection Error:", err);
    return;
  }

  console.log("Connected to MySQL");
});

app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/employees", (req, res) => {
  const { name } = req.body;

  db.query(
    "INSERT INTO employees(name) VALUES(?)",
    [name],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.json({
        message: "Employee Added",
      });
    }
  );
});

app.listen(3000, () => {
  console.log("App Running on Port 3000");
});