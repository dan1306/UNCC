const http = require("node:http");

const agent = new http.Agent({keepAlive: true});

const req = http.request({
    agent,
    hostname: "localhost",
    port: 8050,
    method: "POST",
    path: "/create-post",
    headers: {
        "Content-Type": "application/json",
        "name": "Dan"
    }
});

// This event is emitted only once
req.on("response", (res) => {
    console.log("----------- STATUS: -----------");
    console.log(res.statusCode);

    console.log("----------- HEADERS: -----------");
    console.log(res.headers);

    console.log("----------- BODY: -----------");
    res.on("end", (chunk) =>{
        console.log(`No more data in response.`);
    })
});

req.end(JSON.stringify({title: "Title of my post!", body: "This is some text and more and more."}));
// req.end(JSON.stringify());
// req.write(JSON.stringify({message: "Hey you still there?"}));

// req.end(JSON.stringify({message: "This is going to be my last message!"}));