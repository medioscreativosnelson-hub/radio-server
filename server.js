const express = require("express");
const app = express();

app.use(express.static("public"));

let clients = [];

// Ruta para escuchar
app.get("/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache"
  });

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(c => c !== res);
  });
});

// Ruta para recibir audio
app.post("/audio", (req, res) => {
  req.on("data", chunk => {
    clients.forEach(client => client.write(chunk));
  });

  req.on("end", () => res.end());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));
