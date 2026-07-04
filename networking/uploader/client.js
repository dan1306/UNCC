const net = require('net');
const fs = require("node:fs/promises");

const socket = net.createConnection({host: "localhost", port: 5050}, async ()=>{
    const filePath = "./text.txt";
    const fileHandle = await fs.open(filePath, "r");
    const fileStream = fileHandle.createReadStream();

    // reading into destination 
    fileStream.on('data', (data)=>{
        let result = socket.write(data);

        if(!result) fileStream.pause();

    });
    fileStream.on("end", async()=>{
        console.log("file transferred.");

        socket.end();
        await fileHandle.close();
    })

    socket.on("drain", () =>{
        fileStream.resume();
    })

});