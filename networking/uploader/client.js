const net = require('net');
const fs = require("node:fs/promises");
const path = require("path");

const moveCursor = (dx, dy) => {
    return new Promise( (resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve()
        })
    })
}

const clearline = (dir) => {
    return new Promise((resolve, reject) => {

        process.stdout.clearLine(dir, () => {
            resolve();
        })
    })
}

console.log()
const socket = net.createConnection({host: "localhost", port: 5050}, async ()=>{

    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    // const filePath = "./text.txt";
    const fileHandle = await fs.open(filePath, "r");
    const fileStream = fileHandle.createReadStream();
    const fileSize = (await fileHandle.stat()).size;

    // for showing upload progress
    let uploadPercentage = 0;
    let bytesUploaded = 0;

    
    socket.write(`fileName: ${fileName}-------`);
    
    // reading into destination 
    fileStream.on('data', async (data)=>{
        let result = socket.write(data);

        if(!result) fileStream.pause();

        bytesUploaded += data.length;  // add the number of bytes read to the variable
        let newPercentage = Math.floor((bytesUploaded/fileSize) * 100);
        
        if(newPercentage !== uploadPercentage){
            uploadPercentage = newPercentage;
            await moveCursor(0, -1);
            await clearline(0);
            console.log(`uploading... ${uploadPercentage}%`);
        }

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