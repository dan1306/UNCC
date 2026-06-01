const fs = require('node:fs/promises');

(async ()=> {
    console.time("writeMany");
    const fileHandle = await fs.open("test.txt", "w");

    const stream = fileHandle.createWriteStream();


    let i = 0;
    const writeMany = () => {
        while(i < 1000000){
            const buff = Buffer.from(`${i} `, "utf-8");

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
