const http = require("node:http");
const fs = require("node:fs/promises");

class Butter {
    constructor() {
        this.server = http.createServer();
        // {
        //     "get /": () =>{},
        //     "post /upload": () => {},
        
        
        //     this.routes["get /"]{}
        
        // }

        this.routes = {};
        this.middleware = [];

        this.server.on("request", (req, res) => {
            // console.log("Request came in.");

            // Send a file back to the client
            res.sendFile = async (path, mime_type) => {
                const fileHandle = await fs.open(path, "r");
                const fileStream = fileHandle.createReadStream();

                res.setHeader("Content-Type", mime_type);

                fileStream.pipe(res);
            }

            // set the status code of the response
            res.status = (code) => {
                res.statusCode = code;
                return res;
            }

            // sends JSON data back to the client (for small json data less than the highWaterMark)
            res.json = (data) => {
                // This is only good for bodies with a size less than the highwatermark value
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
            };

            const runMiddleWear = (req, res, middleware, index) => {
                // exit point
                if(index == middleware.length){
                    // If the routes object does not have a key of req.method + req.url, return 484
                    if(!this.routes[req.method.toLocaleLowerCase() + req.url]){
                        return res.status(404).json({error: `Cannot ${req.method} ${req.url}`}) 
                    }
                    this.routes[req.method.toLowerCase() + req.url](req, res);
                } else {
                    middleware[index](req, res, ()=>{
                        runMiddleWear(req, res, middleware, index + 1);
                    })
                }
            }

            runMiddleWear(req, res, this.middleware, 0);
            // run all middleware function, before running corresponding routes
            // this.middleware[0](req, res, ()=>{
            //     this.middleware[1](req, res, () => {
            //         this.middleware[2](req, res, () => {
            //             this.routes[req.method.toLowerCase() + req.url](req, res);
            //         });
            //     });
            // });

        });
    }

    route (method, path, cb) {
        this.routes[method + path] = cb;
    }

    beforeEach (cb){
        this.middleware.push(cb);
    }

    listen(port, cb) {
        this.server.listen(port, () => {
            cb();
        });
    }

}


module.exports = Butter;