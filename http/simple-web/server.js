const http = require("node:http");
const fs = require("node:fs/promises");
const server = http.createServer();

server.on("request", async(req, res) => {
    // console.log(req.url);
    // console.log(req.method);

    if(req.url === "/" && req.method === "GET"){
        res.setHeader("Content-type", "text/html");
        
        const fileHandle = await fs.open("./public/index.html", "r");
        const fileStream = fileHandle.createReadStream();
        
        fileStream.pipe(res);
    }

    if(req.url === "/styles.css" && req.method === "GET"){
        res.setHeader("Content-type", "text/css");
        
        const fileHandle = await fs.open("./public/styles.css", "r");
        const fileStream = fileHandle.createReadStream();
        
        fileStream.pipe(res);
    }

    if(req.url === "/script.js" && req.method === "GET"){
        res.setHeader("Content-type", "text/javascript");
        
        const fileHandle = await fs.open("./public/script.js", "r");
        const fileStream = fileHandle.createReadStream();
        
        fileStream.pipe(res);
    }

    if(req.url === "/login" && req.method === "POST"){
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;

        const body = {
            message: "Logging you in...",
        }

        res.end(JSON.stringify(body));
    }

    if(req.url === "/user" && req.method === "PUT"){
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 401;

        const body = {
            message: "You first have to be logged in...",
        }

        res.end(JSON.stringify(body));
    }
})


server.listen(9000, () =>{
    console.log("Web server is live at http://localhost:9000")
})