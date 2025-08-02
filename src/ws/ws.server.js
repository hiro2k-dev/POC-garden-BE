const WebSocket = require("ws");
const { wsPath, authToken } = require("../config/env");
const logger = require("../utils/logger");

const clients = new Set();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: wsPath });

  wss.on("connection", (ws, req) => {
    const rawProtocols = req.headers["sec-websocket-protocol"];
    const clientProtocol = rawProtocols?.split(",")[0]?.trim();

    if (clientProtocol !== authToken) {
      ws.close(1008, "Unauthorized");
      return;
    }

    logger.info("New WebSocket connection");
    clients.add(ws);

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);
        console.log(data);
        
        if (data.type === "relay_control") {
          for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(data));
            }
          }

          ws.send(JSON.stringify({ type: "relay_response", status: "sent" }));
        }

        if (data.type === "relay_status") {
          for (const client of clients) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              console.log("Sending status:", data)
              client.send(JSON.stringify(data));
            }
          }
        }
      } catch (err) {
        logger.error("Invalid WS Message:", err);
        ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      logger.info("Client disconnected");
    });
  });

  logger.info(`WebSocket server listening on ${wsPath}`);
}

module.exports = setupWebSocket;
