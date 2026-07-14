const Butter = require("../butter");

// A sample object in this array would look like:
// {userId: 1, token: 234234234}
const SESSIONS = [];

const USERS = [
    {id: 1, name: "Tom Brown", username : "tb242", password: "1"},
    {id: 2, name: "Haley Brown", username : "hb242", password: "2"},
    {id: 3, name: "Diddy Brown", username : "db242", password: "3"},
];

const POSTS = [
    {
        id: 1,
        userId: 1, // Links to Tom Brown
        title: "Lorem Ipsum Dolor",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
        id: 2,
        userId: 2, // Links to Haley Brown
        title: "Sed Ut Perspiciatis",
        body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto."
    },
    {
        id: 3,
        userId: 1, // Links to Tom Brown
        title: "At Vero Eos Et Accusamus",
        body: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati."
    }
];


const PORT = 8000;

const server = new Butter();

server.beforeEach((req, res, nxt)=> {
    // setTimeout(() => {
        console.log("first middleware function");
        nxt();
    // }, 2000);\
})

server.beforeEach((req, res, nxt)=> {
    setTimeout(() => {
        console.log("second middleware function");
        nxt();
    }, 2000);
})

server.beforeEach((req, res, nxt)=> {
    // setTimeout(() => {
        console.log("third middleware function");
        nxt();
    // }, 2000);
})

// ------ FILES ROUTES ------ //
server.route("get", "/", (req, res) => {
    console.log("this is the '/' route")
    res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/login", (req, res) => {
    res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/profile", (req, res) => {

    res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
    res.sendFile("./public/styles.css", "text/css");
});

server.route("get",  "/scripts.js", (req, res) => {
    res.sendFile("./public/scripts.js", "text/javascript");
});

// ------ JSON ROUTES ------ //

// log a user in and give them a token
server.route("post", "/api/login", (req, res) => {
    
    let body = "";
    req.on("data", (chunk) => {
        body = chunk.toString("utf-8");
    })

    req.on("end", () => {
        body = JSON.parse(body);
        console.log(body);
        
        const userName = body.username;
        const password = body.password;
    

        // check if the user exist
        const user = USERS.find((user) => user.username === userName);
        
        // if user exist then check password
        if(user && user.password === password) {
            // at this point we have validated the user info



            const token = Math.floor(Math.random() * 10000000000000).toString();

            // save generated token
            SESSIONS.push({userId: user.id, token: token});

            res.setHeader("Set-Cookie", `token=${token}; Path/;`);
            res.status(200).json({message:"Logged in successfully."})
        } else {
            res.status(401).json({error: "Invalid username or password."});
        }
    
    })


    
})

// log user out
server.route("delete", "/api/logout", (req, res) => {

})

// update user info
server.route("put", "/api/user", (req, res) => {

})

// create a post
server.route("post", "/api/posts", (req, res) => {

})

// send user info
server.route("get", "/api/user", (req, res) => {
    const token = req.headers.cookie.split("=")[1];
    const sessions = SESSIONS.find((session)=> session.token === token);
    if(sessions){
        // Send users profile info
        const user = USERS.find((user) => user.id === sessions.userId);
        res.json({username: user.username, name: user.name});
    }else{
        res.status(401).json({error: "Unauthorized"})
    }
    // res.status(200).json({message: "o"})
})


// Send list of all posts that we have
server.route("get", "/api/posts", (re1, res) => {

    const posts = POSTS.map((post) => {

        const user = USERS.find((user) => user.id === post.userId)
        post.author = user.name;
        return post;
    })

    res.status(200).json(posts);
})

server.listen(PORT, () => {
    console.log("Server has started on port " + PORT);
});