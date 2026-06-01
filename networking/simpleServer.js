const net = require("net");
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        console.log(data.toString("utf-8"));
    })
});

server.listen(1234, "127.0.0.1", () => {
    console.log("opening server on", server.address());
});