const express = require('express');
const http = require('http');
const cors = require('cors');
const logger = require('./utils/logger');
const { port } = require('./config/env');

const healthRoute = require('./routes/health.route');
const setupWebSocket = require('./ws/ws.server');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-token'],
}));

app.use(express.json());

app.use('/api', healthRoute);

const server = http.createServer(app);
setupWebSocket(server);

server.listen(port, () => {
  logger.info(`🚀 HTTP server listening at http://localhost:${port}`);
});
