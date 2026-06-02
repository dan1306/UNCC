const http = require('http');
const port = 4080;

const server = http.createServer((req, res) => {
    const data = {message: 'hi there|'};

    res.setHeader("Content-type", "application/json");
    res.setHeader("Connection", "close");
    res.statusCode = 200;
    res.end(JSON.stringify(data));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})