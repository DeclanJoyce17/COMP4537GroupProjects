const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 3000;
let dictionary = [];
let requestCount = 0;

/*
200: Succesfully found entry
201: Succesfully added entry
400: Invalid request/input
404: Not Found
409: Conflict
*/

const server = http.createServer((req, res) => {
    // Enable CORS for cross-origin requests from Server 1
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (req.method === 'GET' && path === '/api/definitions') {

        //get
        requestCount++;
        const word = query.word;

        //checks for validity of request
        if (!word || typeof word !== 'string') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ message: "Invalid request. Please provide a word." }));
        }

        //checks if the word exists at all
        const entry = dictionary.find(entry => {
            return entry.word.toLowerCase() === word.toLowerCase();
        });

        //decides what to do depending on if the word already exists
        if (entry) {
            //returns the request count, word, and definiiton
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const definiiton = entry.definiiton;
            res.end(JSON.stringify({ requestCount, word, definiiton }));
        } else {
            //error word not found
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ requestCount, message: 'Word ' + word + ' not found!' }));
        }

    } else if (req.method === 'POST' && path === '/api/definitions') {

        //post
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {

            requestCount++;
            const data = JSON.parse(body);
            const word = data.word;
            const definition = data.definition;

            //checks for valididty of the input
            if (!word || !definition || typeof word !== 'string' || typeof definition !== 'string') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: "Invalid input. Word and definition must be non-empty strings." }));
            }

            //checks if the word already exists
            const entry = dictionary.find(entry => {
                return entry.word.toLowerCase() === word.toLowerCase();
            });

            //decides what to do depending on whether the word exists
            if (entry) {
                //error, word already exists
                res.writeHead(409, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Warning! ' + word + ' already exists.' }));
            } else {

                //returns the request count, 
                dictionary.push({ word, definition });
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    requestCount,
                    totalWords: dictionary.length,
                    message: 'New entry recorded: ' + word + ':' + definition
                }));

            }

        });

    } else {

        //error
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Endpoint not found." }));

    }
});

//run the server
server.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT + '/');
});
