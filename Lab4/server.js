const http = require('http');
const url = require('url');
const port = process.env.PORT || 3000;

let dictionary = [];
let requestCount = 0;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.path === '/api/definitions') {

        requestCount++;
        const word = parsedUrl.query.word;



    } else if (req.method === 'POST' && parsedUrl.path === '/api/definitions') {
        requestCount++;
        const data = JSON.parse(body);
        const word = data.word;
        const definition = data.definition;

        if (dictionary.includes(word.toLowerCase())) {
            //Case for if dictionary already includes word
            res.writeHead();
            return res.end();
        } else if (!dictionary.includes(word.toLowerCase())) {
            //case for if dictionary doesn't include word

            dictionary.push({ word, definition });

            res.writeHead();
            return res.end();
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Endpoint not found." }));
    }

});


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});