const { read } = require('node:fs');
const fs = require('node:fs/promises');
const {pipeline} = require("node:stream");
// (async () => {

//     const destFile = await fs.open("src-copy.txt", "w");
//     const result = await fs.readFile("src.txt");

//     await destFile.write(result);
//     console.log(result);

// })();

// (async () => {

//     console.log("copy");

//     const srcFile = await fs.open("src.txt", 'r');
//     const destFile = await fs.open('txt-copy.txt', 'w');
    
//     let bytesRead = -1;

//     while(bytesRead !== 0) {

//         const readRes = (await srcFile.read());

//         console.log(readRes)

//         // if(bytesRead !== 'what is the max size of the buff') {
//         //     const indexOfNotFilled = readRes.buffer.indexOf(0);
//         //     const newbuf = Buffer.alloc(indexOfNotFilled);
//         //     readRes.buffer.copy(newbuf, 0, 0, indexOfNotFilled);
//         //     destFile.write(newbuf``);
//         // }else {
//         //     destFile.write(readRes.buffer);
//         // }

//         bytesRead = readRes.bytesRead;
//         destFile.write(readRes.buffer);
//     }
    


//     // console.log(result);

// })();

(async () => {

    console.log("copy");

    const srcFile = await fs.open("src.txt", 'r');
    const destFile = await fs.open('txt-copy.txt', 'w');
    
    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    // readStream.pipe(writeStream);

    // readStream.on("end", () =>{
    //     console.timeEnd("copy");
    // })
   // console.log(result);
    pipeline(readStream, writeStream, (err) => {
        console.log(err);
        console.timeEnd("Copy");
    });
})();


