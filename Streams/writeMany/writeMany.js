const fs = require('node:fs/promises');

(async ()=> {
    console.time("writeMany");
    const fileHandle = await fs.open("test.txt", "w");

    const stream = fileHandle.createWriteStream();


    let i = 0;
    const numberOfWrites = 500000000;
    const writeMany = () => {
        while(i <= numberOfWrites){
            const buff = Buffer.from(`${i} `, "utf-8");

            // last write
            if (i == numberOfWrites) {
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
