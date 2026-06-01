const {Buffer} = require("buffer");

const memContainer = Buffer.alloc(4); // 4 bytes (32 bits)

memContainer[0] = 0xF4;

console.log(memContainer[0]);