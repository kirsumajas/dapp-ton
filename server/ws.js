const WebSocket = require('ws');

let wss;
const clients = new Map(); // Map<telegramId, ws>

function initWebSocket(server) {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const telegramId = new URLSearchParams(req.url.split('?')[1]).get('telegramId');
    if (!telegramId) {
      ws.close();
      return;
    }

    clients.set(telegramId, ws);

    // Optional: ping-pong heartbeat to detect dead clients
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('close', () => {
      clients.delete(telegramId);
    });
  });

  // Ping clients every 30s to keep connection alive and remove dead clients
  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
}

function pushToUser(telegramId, event, data) {
  const ws = clients.get(String(telegramId));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
}

module.exports = { initWebSocket, pushToUser };
