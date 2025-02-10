const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const PORT = process.env.PORT || 3000;

let dictionary = [];
let requestCount = 0;

/*
HTTP Status Codes:
200: Successfully found
201: Successful action
400: Invalid request/input
404: Not Found
409: Conflict
*/

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

    // Handle preflight (OPTIONS) requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Serve static files
    if (pathName.startsWith('/scripts/') || pathName.startsWith('/styles/') || pathName.startsWith('/images/')) {
        const filePath = path.join(__dirname, pathName);
        const extname = path.extname(filePath);

        // Determine content type
        let contentType = 'text/plain';
        if (extname === '.html') contentType = 'text/html';
        else if (extname === '.js') contentType = 'application/javascript';
        else if (extname === '.css') contentType = 'text/css';
        else if (extname === '.jpg' || extname === '.jpeg') contentType = 'image/jpeg';
        else if (extname === '.png') contentType = 'image/png';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
        return;
    }

    // Serve HTML pages
    if (pathName === '/search' || pathName === '/store') {
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

    // Handle GET requests to /api/definitions
    if (req.method === 'GET' && pathName === '/api/definitions') {
        requestCount++;
        const word = query.word;

        if (!word || typeof word !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: 'Invalid request. Please provide a word.' }));
        }

        const entry = dictionary.find(entry => entry.word.toLowerCase() === word.toLowerCase());

        if (entry) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ requestCount, word, definition: entry.definition }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ requestCount, message: `Word ${word} not found!` }));
        }
    }

    // Handle POST requests to /api/definitions
    else if (req.method === 'POST' && pathName === '/api/definitions') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            requestCount++;
            const data = JSON.parse(body);
            const word = data.word;
            const definition = data.definition;

            if (!word || !definition || typeof word !== 'string' || typeof definition !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Invalid input. Word and definition must be non-empty strings.' }));
            }

            const entry = dictionary.find(entry => entry.word.toLowerCase() === word.toLowerCase());

            if (entry) {
                res.writeHead(409, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: `Warning! ${word} already exists.` }));
            } else {
                dictionary.push({ word, definition });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    requestCount,
                    totalWords: dictionary.length,
                    message: `New entry recorded: ${word}: ${definition}`,
                }));
            }
        });
    }

    // Handle undefined routes
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Endpoint not found.' }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
