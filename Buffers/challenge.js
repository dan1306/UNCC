const {Buffer} = require("buffer");

const memContainer = Buffer.alloc(3); // 3 bytes (24 bits)

memContainer[0] = 0b01001000;

memContainer[1] = 0b01101001;

memContainer[2] = 0b00100001;

console.log(memContainer.toString("utf8"));
