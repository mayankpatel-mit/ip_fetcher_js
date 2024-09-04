const express = require('express');
const app = express();
const PORT = 3000;

// Function to get IP address from headers and socket
const getIpAddress = (req) => {
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  const xRealIp = req.headers['x-real-ip'];
  const xForwardedFor = req.headers['x-forwarded-for'];
  const socketRemoteAddress = req.socket.remoteAddress;

  return {
    cfConnectingIp: cfConnectingIp || 'Not found',
    xRealIp: xRealIp || 'Not found',
    xForwardedFor: xForwardedFor || 'Not found',
    socketRemoteAddress: socketRemoteAddress || 'Not found',
  };
};

app.get('/', (req, res) => {
  const ipAddress = getIpAddress(req);
  res.json({
    message: 'User IP information',
    ipAddress,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});