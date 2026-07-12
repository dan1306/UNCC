const Butter = require("../butter");

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

// ------ FILES ROUTES ------ //
server.route("get", "/", (req, res) => {
    res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
    res.sendFile("./public/styles.css", "text/css");
});

server.route("get",  "/scripts.js", (req, res) => {
    res.sendFile("./public/scripts.js", "text/javascript");
});

// ------ JSON ROUTES ------ //
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