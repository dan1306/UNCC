const { rejects } = require("assert");
const { Socket } = require("dgram");
const net = require("net");

const readLine = require("readline/promises");

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
});


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

let id;

const socket = net.createConnection({port: 1234, host: '127.0.0.1'}, async () => {
    console.log("Connected to the server!");


    const ask = async () => {
        const message = await rl.question("Enter a message > ");
        // move the cursor one line up
        await moveCursor(0, -1);
        // clear the curr line the cursor is in  
        await clearline(0);
        socket.write(`${id}--message-${message}`);
    };

    ask();

    socket.on("data", async (data) => {
        console.log() 
        await moveCursor(0, -1);
        await clearline(0);
 
        if(data.toString("utf-8").substring(0, 2) === "id") {
            id = data.toString("utf-8").substring(3);
            console.log(`Your id is ${id}\n`);
        } else {
           console.log(data.toString("utf-8"));
 
        }

        ask();
   })
});

socket.on("end", () =>{
    console.log("Server ended.");
});

process.on("SIGINT", ()=> {
    console.log("hello");
    socket.destroy();
    process.exit(0);
})