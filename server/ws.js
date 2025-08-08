// server/ws.js
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

    ws.on('close', () => {
      clients.delete(telegramId);
    });
  });
}

function pushToUser(telegramId, event, data) {
  const ws = clients.get(String(telegramId));
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
}

module.exports = { initWebSocket, pushToUser };
