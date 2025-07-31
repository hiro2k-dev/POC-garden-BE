const logger = require('../../utils/logger');

function handleRelayCommand(ws, payload) {
  logger.info(`Relay handler received: ${JSON.stringify(payload)}`);
  const status = payload?.state === 'on' ? 'Activated' : 'Deactivated';
  ws.send(JSON.stringify({ type: 'relay_response', status }));
}

module.exports = handleRelayCommand;