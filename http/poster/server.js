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

// for authentication
server.beforeEach((req, res, nxt)=> {
    
    const routesToAuthenticate = ["GET /api/user", "PUT /api/user", "POST /api/post", "DELETE /api/logout"];
    
    if(routesToAuthenticate.indexOf(req.method + " "+ req.url) !== -1){
        // if we have token cookie, then save the userId to the res object
        if (req.headers.cookie){ 
            const token = req.headers.cookie.split("=")[1];
            const sessions = SESSIONS.find((session)=> session.token === token);
            if(sessions){
                req.userId = sessions.userId;
                return nxt();
            }
        }
        return res.status(401).json({error: "unauthorized"})
    } else {
        nxt();
    }

    
})

// parsing JSON Body
server.beforeEach((req, res, nxt)=> {
    // This is only good for bodies with a size less than the highwatermark value
    if(req.headers["content-type"] === "application/json"){
        let body = "";
        req.on("data", (chunk) => {
            body = chunk.toString("utf-8");
        })

        req.on("end", () => {
            body = JSON.parse(body);
            req.body = body;
            return nxt();
        })
    } else {
        nxt();
    }
})

server.beforeEach((req, res, nxt)=> {
    const routes = ["/", "/login", "/profile", "/new-post"];
    if(routes.indexOf(req.url) !== -1 && req.method === "GET") {
        return res.status(200).sendFile("./public/index.html", "text/html");
    }else{
        nxt();
    } 
})

server.beforeEach((req, res, nxt)=> {
    const routes = ["/styles.css", "/scripts.js"];
    if(routes.indexOf(req.url) !== -1 && req.method === "GET") {
        if(req.url == "/styles.css") return res.status(200).sendFile("./public/styles.css", "text/css");
        else return res.status(200).sendFile("./public/scripts.js", "text/javascript"); 
    }else{
        nxt();
    } 
})

// ------ FILES ROUTES ------ //

// server.route("get", "/styles.css", (req, res) => {
//     res.sendFile("./public/styles.css", "text/css");
// });

// server.route("get",  "/scripts.js", (req, res) => {
//     res.sendFile("./public/scripts.js", "text/javascript");
// });

// ------ JSON ROUTES ------ //

// log a user in and give them a token
server.route("post", "/api/login", (req, res) => {
        
    const userName = req.body.username;
    const password = req.body.password;
    
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

// log user out
server.route("delete", "/api/logout", (req, res) => {
    // remove sessions object from session array
    const sessionIndex = SESSIONS.findIndex((session) => session.userId === req.userId);
    if(sessionIndex > -1) {
        SESSIONS.splice(sessionIndex, 1);
    }

    res.setHeader("Set-Cookie", "token=deleted; path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    res.status(200).json({message: "logged out."});
})

// // update user info
server.route("put", "/api/user", (req, res) => {
    const username = req.body.username;
    const name = req.body.name;
    const password = req.body.password;
    // grab the user obj currently logged in
    const user = USERS.find((user) => user.id === req.userId);
    user.username = username;
    user.name = name;

    // only update password if provided
    if(password) {
        user.password = password;
    }

    res.status(200).json({username: user.username, name: user.name, password_updated: password ? true : false });

})

// create a post
server.route("post", "/api/posts", (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    
    const token = req.headers.cookie.split("=")[1];
    console.log(token);
    // return;
    if(token){
        const user = SESSIONS.find((s) => s.token == token)
        // console.log(user);
        // return
        if(user){
            const post = {
                id: POSTS.length + 1,
                title: title,
                body: body,
                userId: user.userId
                // author: req.name
        };

        POSTS.push(post);
        res.status(201).json(post);
        }
    }
   
})

// send user info
server.route("get", "/api/user", (req, res) => {
    // Send users profile info
    const user = USERS.find((user) => user.id === req.userId);
    res.json({username: user.username, name: user.name});
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