//Here is where you'll set up your server as shown in lecture code
import express from "express";
const app = express();
import configRoutes from "./routes/index.js";

let requestCount = 0;
const URLs = {};

app.use(express.json());

// middleware 1
app.use("/", async (req, res, next) => {
  if (req.method) {
    requestCount++;
    console.log("Total number of requests to the server: " + requestCount);
  }
  next();
})


// mideleware 2
app.use("/", async (req, res, next) => {
  console.log("Request Body: " + JSON.stringify(req.body));
  console.log("URL Path Request: " + req.path + "\nHTTP Verb: " + req.method);
  next();
})


// mideleware 3
app.use("/", async (req, res, next) => {
  if(Object.keys(URLs).length === 0 || !(req.path in URLs)) {
    URLs[req.path] = 1;
  }
  else {
    URLs[req.path] = URLs[req.path] + 1;
  }
  console.log("Number of requests to " + req.path + ": " + URLs[req.path] + "\n");
  next();
})

const staticDir = express.static("public");
app.use("/public", staticDir);

app.use(express.urlencoded({ extended: true }));

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000\n");
});
