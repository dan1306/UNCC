const {Writable} = require("node:stream");
const fs  = require("node:fs");
// const fsPromises = require("node:fs/promises");

class FileWriteStream extends Writable {
    constructor({highWaterMark, fileName}) {
        super({highWaterMark});

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.numOfWrite = 0;
    }

    // runs after the constructure, and puts off calling other methods
    // until we call the callback function
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if(err) {
                // so if we call callback with an err means we have an err
                // and should not proceed
                callback(err);
            } else {
                this.fd = fd;
                // no args means successful
                callback();
            }
        });

    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err)=>{
            if (err) return callback(err);
            this.chunks = [];
            callback();

        })
    }

    _destroy(error, callback) {
        console.log(`Number of writes: ${this.numOfWrite}`);
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error);
            })
        } else {
            callback(error);
        }
    }

    _write(chunk, encoding, callBack) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;
        if(this.chunksSize > this.writableHighWaterMark){
            fs.write(this.fd, Buffer.concat(this.chunks), (err) =>{
                if(err) return callBack(err);
                this.chunks = [];
                this.chunksSize = 0;
                ++this.numOfWrite;
                callBack();
            })
        } else {
            callBack();
        }
        // write operation
        // fs.write
        // once done call callback
        // callBack()
    }
}

// const stream = new FileWriteStream({highWaterMark: 1800, fileName: 'text.txt'});

// const fs = require('node:fs/promises');

(async ()=> {
    console.time("writeMany");
    // const fileHandle = await fsPromises.open("test.txt", "w");


    const stream = new FileWriteStream({fileName: 'text.txt'});


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

    let d = 0;

    // resume loop once stream internal buffer is emptied
    // stream.on("drain", () => {
    //     ++d;
    //     writeMany();
    // })

    // resume loop when buffer drained
    stream.on("drain", ()=> {
        ++d;
        writeMany();        
    });

    stream.on("finish", ()=> {
        // console.log(stream.writableLength);
        console.log("Number of drains: ", d);
        console.timeEnd("writeMany");
        // fileHandle.close();
    })
   
})();



// stream.write(Buffer.from("this is some string. "));
// stream.end(Buffer.from("Our last write."));


// stream.on("finish", () => {
//     console.log("Stream was finished");
// });

