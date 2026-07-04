const net = require("net");
const fs = require("node:fs/promises");
const { finished } = require("node:stream/promises"); // Used to safely await streams
const server = net.createServer(()=>{}); 
// let fileHandle, fileStream;


server.on("connection", async(socket) => {
    console.log("New connection.");
    let fileHandle = await fs.open("storage/text.txt", "w");
    let fileStream = fileHandle.createWriteStream();
    socket.on("data", async (data)=>{
        
        // writing to destination
        
        let result = fileStream.write(data);

        if(!result) socket.pause();

    });
    
    socket.on("end", async()=>{
        fileStream.end();            // 1. Tell the stream no more data is coming
        await finished(fileStream);  // 2. Wait for the stream to write everything to disk
        await fileHandle.close();    // 3. Now it is 100% safe to close the system file handle
    });

    fileStream.on("drain", () => {
            socket.resume()
    });

});

server.listen(5050, "localhost", () => {
    console.log("Uploader server opened on", server.address());
})