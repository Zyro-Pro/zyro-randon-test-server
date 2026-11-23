const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ZYRO Random Test Server is running");
});

const wss = new WebSocket.Server({ server });

const players = [
  { id: "LOCAL", x: 0, y: 0, local: true },
  { id: "TEST-1", x: 15, y: 10, local: false },
  { id: "TEST-2", x: -25, y: 20, local: false },
  { id: "TEST-3", x: 35, y: -15, local: false },
  { id: "TEST-4", x: -40, y: -25, local: false }
];

function movePlayers() {
  for (let i = 1; i < players.length; i++) {
    players[i].x += (Math.random() - 0.5) * 4;
    players[i].y += (Math.random() - 0.5) * 4;

    players[i].x = Math.max(-90, Math.min(90, players[i].x));
    players[i].y = Math.max(-90, Math.min(90, players[i].y));
  }
}

function broadcastPositions() {
  const message = JSON.stringify({
    type: "positions",
    players: players
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", (socket) => {
  socket.send(JSON.stringify({
    type: "positions",
    players: players
  }));
});

setInterval(() => {
  movePlayers();
  broadcastPositions();
}, 500);

server.listen(PORT, "0.0.0.0", () => {
  console.log("ZYRO Random Test Server running on port " + PORT);
});
