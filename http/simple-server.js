const http = require("node:http");

const server = http.createServer();

server.on("request", (req, res) => {

    console.log("----------- METHOD: -----------");
    console.log(req.method);

    console.log("----------- URL: -----------");
    console.log(req.url);

    console.log("----------- HEADERS: -----------");
    console.log(req.headers);

    const name = req.headers.name;

    console.log("----------- BODY: -----------");
    // console.log(req.headers);

    let data = "";

    req.on("data", (chunk) => {
        data += chunk.toString();
        // console.log(chunk.toString("utf-8"));
    })

    req.on("end", ()=>{
        data = JSON.parse(data);
        
        console.log(data);
        console.log(name);
        // res.setHeader("Content-Type", "application/json")
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({message: `Post with title ${data.title} was created ${name}`}))
    })

})

server.listen(8050, () => {
    console.log("Server listening on http://localhost:8050")
})

