const http = require('http');
const mysql = require('mysql2');
const url = require('url');
const PORT = process.env.PORT || 3000;

const con = mysql.createConnection({
    host: 'localhost',
    user: 'yourusername',
    password: 'yourpassword',
    database: 'lab5db'
});

con.connect(err => {

    if (err) throw err;
    console.log("Connected to MySQL");

    con.query("CREATE DATABASE IF NOT EXISTS lab5db", err => {

        if (err) throw err;

        con.query(`CREATE TABLE IF NOT EXISTS patient (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            age INT,
            diagnosis VARCHAR(255)
        ) ENGINE=InnoDB;`, err => {
            if (err) throw err;
        });

    });
});

const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === 'POST') {

        let body = '';
        req.on('data', chunk => body += chunk);

        req.on('end', () => {

            const { query } = JSON.parse(body);
            if (!query.toUpperCase().startsWith("INSERT")) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end("Only INSERT queries are allowed via POST.");
            }

            con.query(query, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end("Database error.");
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end("Data inserted successfully.");
            });

        });

    } else if (req.method === 'GET') {

        const queryObj = url.parse(req.url, true).pathname.replace('/lab5/api/v1/sql/', '');

        const query = decodeURIComponent(queryObj);

        if (!query.toUpperCase().startsWith("SELECT")) {

            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end("Only SELECT queries are allowed via GET.");

        }

        con.query(query, (err, result) => {

            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end("Database error.");
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));

        });
        
    }
})

server.listen(PORT);