const http = require('http');
const mysql = require('mysql2');
require('dotenv').config();
const url = require('url');
const path = require('path');
const fs = require('fs');
const PORT = process.env.MYSQL_ADDON_PORT || 3000;

const con = mysql.createConnection({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    database: process.env.MYSQL_ADDON_DB
});


con.connect(err => {

    if (err) throw err;
    console.log("Connected to MySQL");

    con.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_ADDON_DB}`, err => {

        if (err) throw err;

        con.query(`CREATE TABLE IF NOT EXISTS lab5db (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            dateOfBirth DATE
        ) ENGINE=InnoDB;`, err => {
            if (err) throw err;
        });


    });
});

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight (OPTIONS) requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content
        res.end();
        return;
    }


    // Serve static files
    if (pathName.startsWith('/scripts/') || pathName.startsWith('/styles/') || pathName.startsWith('/images/') || pathName.startsWith('/lang/')) {
        const filePath = path.join(__dirname, pathName);  // Construct the correct file path

        const extname = path.extname(filePath);  // Get file extension for content-type
        let contentType = 'text/plain';

        // Determine the content type based on file extension
        if (extname === '.html') contentType = 'text/html';
        else if (extname === '.js') contentType = 'application/javascript';
        else if (extname === '.css') contentType = 'text/css';
        else if (extname === '.jpg' || extname === '.jpeg') contentType = 'image/jpeg';
        else if (extname === '.png') contentType = 'image/png';

        // Read the file and send it as a response
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
        return;  // Stop further processing as static file has been served
    }


    // Serve HTML pages
    if (pathName === '/index') {
        const filePath = path.join(__dirname, 'views', pathName + '.html');
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }


    if (req.method === 'POST') {

        let body = '';
        req.on('data', chunk => body += chunk);

        req.on('end', () => {

            const { name, dateOfBirth } = JSON.parse(body);

            if (!name || !dateOfBirth) {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                return res.end("Missing required fields.");
            }

            const sql = "INSERT INTO patient (name, dateOfBirth) VALUES (?, ?)";

            con.query(sql, [name, dateOfBirth], (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end("Database error.");
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Data inserted successfully.", id: result.insertId }));
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