const server = require("express")();

server.set("view engine", "pug");
server.set("views", "./views");

const routes = require("./routes");
server.use("/", routes);

const port = 3000;
server.listen(port, () => {
  console.log(`Server starts listening on port ${port}`)
});