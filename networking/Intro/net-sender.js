// const { Socket } = require("dgram");
const net = require("net");

const client = net.createConnection({host: "localhost", port: 8050}, () =>{
    const req = Buffer.alloc(8);
    req[0] = 12;
    req[1] = 34;

    client.write(req);
});


client.on("data", (chunk) => {
    console.log("Received Response.");
    console.log(chunk.toString("utf-8"));
    client.end();
})

client.on("end", () => {
    console.log("Connection ended.");
})