const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PASSWORD = "1234";

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("auth", (pass) => {
    if (pass === PASSWORD) {
      socket.join("sala");
      socket.emit("auth_ok");
    } else {
      socket.emit("auth_error");
    }
  });

  socket.on("offer", (data) => socket.to("sala").emit("offer", data));
  socket.on("answer", (data) => socket.to("sala").emit("answer", data));
  socket.on("candidate", (data) => socket.to("sala").emit("candidate", data));
});

server.listen(3000, () => console.log("Servidor activo"));
