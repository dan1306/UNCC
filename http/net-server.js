const { Socket } = require("dgram");
const net = require("net");

const server = net.createServer((socket) =>{
    
    socket.on('data', (data) => {
        console.log(data.toString('utf-8'));
    });

    const response = Buffer.from("0001020304ff", "hex");
    socket.write(response);
})

server.listen(8000, "127.0.0.1", ()=>{
    console.log("opened server on", server.address());
})