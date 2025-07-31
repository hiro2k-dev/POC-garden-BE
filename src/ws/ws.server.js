const WebSocket = require('ws');
const { wsPath, authToken } = require('../config/env');
const logger = require('../utils/logger');

const handleRelayCommand = require('./handlers/relay.handler');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: wsPath });

  wss.on('connection', (ws, req) => {
    const rawProtocols = req.headers['sec-websocket-protocol'];
    const clientProtocol = rawProtocols?.split(',')[0]?.trim();

    logger.info(`🛰 WS connect from ${req.socket.remoteAddress}`);
    logger.info(`🔐 Protocol received: "${clientProtocol}"`);

    if (clientProtocol !== authToken) {
      logger.warn('❌ Unauthorized WebSocket attempt');
      ws.close(1008, 'Unauthorized');
      return;
    }

    logger.info('✅ Authorized WebSocket connection');

    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        logger.info(`📨 Message received: ${msg}`);

        switch (data.type) {
          case 'relay_control':
            handleRelayCommand(ws, data.payload);
            break;
          default:
            ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
        }
      } catch (err) {
        logger.error(`Error parsing message: ${err.message}`);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format' }));
      }
    });

    ws.on('close', () => {
      logger.info('🛑 WebSocket connection closed');
    });
  });

  logger.info(`🧩 WebSocket server ready on path "${wsPath}"`);
}

module.exports = setupWebSocket;
