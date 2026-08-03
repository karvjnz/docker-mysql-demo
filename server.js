const express = require("express");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// MySQL Connection
const db = mysql.createConnection({
    host: "mysql",
    user: "root",
    password: "root123",
    database: "companydb"
});

function connectDatabase() {
    db.connect((err) => {
        if (err) {
            console.log(
                "MySQL not ready. Retrying..."
            );
            setTimeout(
                connectDatabase,
                5000
            );
            return;
        }
        console.log(
            "Connected to MySQL"
        );
    });
}

connectDatabase();

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        message: "Application is running"
    });
});

// Submit Query
app.post("/queries", (req, res) => {

    const {
        full_name,
        email,
        phone,
        country,
        message
    } = req.body;

    if (!full_name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Full Name, Email and Message are required"
        });
    }

    const sql = `
        INSERT INTO queries
        (
            full_name,
            email,
            phone,
            country,
            message
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            full_name,
            email,
            phone,
            country,
            message
        ],
        (err, result) => {

            if (err) {
                console.error("Insert Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save query"
                });
            }

            console.log(
                `New Query Saved: ${full_name} (${email})`
            );

            res.json({
                success: true,
                message: "Query submitted successfully",
                queryId: result.insertId
            });
        }
    );
});

// Get All Queries
app.get("/queries", (req, res) => {

    const sql =
        "SELECT * FROM queries ORDER BY created_at DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch queries"
            });
        }

        res.json(results);
    });
});

// Get Query By ID
app.get("/queries/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "SELECT * FROM queries WHERE id = ?",
        [id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Query not found"
                });
            }

            res.json(results[0]);
        }
    );
});

// Delete Query (Optional Learning Endpoint)
app.delete("/queries/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM queries WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false
                });
            }

            res.json({
                success: true,
                message: "Query deleted successfully"
            });
        }
    );
});

// Start Server
app.listen(PORT, () => {
    console.log(
        `🚀 Server running on http://localhost:${PORT}`
    );
});
