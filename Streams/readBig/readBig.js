const fs = require("node:fs/promises");

(async () => {
    const fileHandleRead = await fs.open("src.txt", "r");
    const fileHandleWrite = await fs.open("dest.txt", "w");

    const streamRead = fileHandleRead.createReadStream();
    const streamWrite = fileHandleWrite.createWriteStream();

    let split;
    

    streamRead.on("data", (chunk) => {
        let numbers = chunk.toString("utf-8").split("  ");
        // console.log(numbers);

    
        if(Number(numbers[0]) !== Number(numbers[1]) ) {
            if(split) numbers[0] = split.trim() + numbers[0].trim();
        }
 

        if(Number(numbers[numbers.length - 2]) + 1 !== Number(numbers[numbers.length - 1])) {
            split = numbers.pop();
        }
        
        numbers.forEach(n => {
            let i = Number(n);

            if(i % 2 === 0) {
                if(!streamWrite.write(" " + i + " ")) streamRead.pause();
            }
        })

       
        // console.log(chunk);
    });

    streamWrite.on("drain", ()=> {
        streamRead.resume();
    });

})();