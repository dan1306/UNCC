const fs = require('node:fs/promises');
// const outputFilePath = 'test.txt'


// console.time("writeMany");
// fs.writeFileSync(outputFilePath, "0 ", 'utf-8');

// for (let i = 1; i < 1000000; i++){
//     fs.appendFileSync(outputFilePath, `${i} `, 'utf-8');
// }

// console.timeEnd("writeMany");

// const outputFilePath = 'test.txt'


(async ()=> {
    console.time("writeMany");
    const fileHandle = await fs.open("test.txt", "w");

    const stream = fileHandle.createWriteStream();

    // // console.log(stream.writableHighWaterMark); //size of internal buffer
    // // console.log(stream.writableLength); // how much of a buffer is filled

    // const buff = Buffer.alloc(stream.writableHighWaterMark)

    // console.log(stream.write(buff));

    // stream.on("drain", () => {
    //     console.log("safe to write more.");
    // })


    let i = 0;
    const writeMany = () => {
        while(i < 1000000){
            const buff = Buffer.from(` ${i} `, "utf-8");

            // last write
            if (i == 999999) {
                return stream.end(buff);

            }

            // if stream.write == false stop loop
            if(!stream.write(buff)) break;
            i++;
        };
    };

    writeMany();

    // resume loop when buffer drained
    stream.on("drain", ()=> {
        writeMany();        
    });

    stream.on("finish", ()=> {
        // console.log(stream.writableLength);
        console.timeEnd("writeMany");
        fileHandle.close();
    })
   
})();


