const http = require('http');
const url = require('url');
const port = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.path === '/api/definitions') {

    } else if (req.method === 'POST' && parsedUrl.path === '/api/definitions') {

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Endpoint not found." }));
    }

});


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});