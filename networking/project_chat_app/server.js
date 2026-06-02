const net = require("net");

const server = net.createServer();

let clients = [];

server.on("connection", (socket) => {

    console.log("A new client connected");

    const clientId = clients.length + 1;

    clients.map((c) => {
        c.socket.write(`User ${clientId} joined!`);
    })

    socket.write(`id-${clientId}`);

    // socket.write();


    socket.on("data", (data)=> {
        // console.log(data.toString("utf-8"));
        let dataString = data.toString("utf-8");
        let id = dataString.substring(0, dataString.indexOf("-"));
        let message = dataString.substring(dataString.indexOf("-message-") + 9);
        for(let i = 0; i < clients.length; i++) clients[i].socket.write(`> User ${id}: ${message}`);
    })

    socket.on("end", () => {
        console.log(clientId);
        for(let i = 0; i < clients.length; i++) {
            if(clients[i].id === clientId) clients = clients.splice(i, 1);
        }
        clients.map((c) => {
            
            c.socket.write(`User ${clientId} left!`);
        })
    })

    clients.push({id: clientId.toString(), socket});
})

server.listen("1234", "127.0.0.1", () => {
    console.log("open server on ", server.address());
})

