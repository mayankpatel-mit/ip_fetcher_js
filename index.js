const express = require('express');
const requestIp = require('request-ip');
const useragent = require('useragent');
const geoip = require('geoip-lite');
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

app.get('/user-info', (req, res) => {
  const clientIp = requestIp.getClientIp(req);
  const geo = geoip.lookup(clientIp);
  const agent = useragent.parse(req.headers['user-agent']);

  const userInfo = {
    ip: clientIp || 'Not found',
    geolocation: geo || 'Not found',
    device: {
      family: agent.device.family,
      platform: agent.os.family,
      browser: agent.family,
      version: agent.toVersion(),
    },
    city: geo?.city || 'Not found',
    country: geo?.country || 'Not found',
    region: geo?.region || 'Not found',
    userAgent: req.headers['user-agent'] || 'Not found',
  };

  res.json({
    message: 'User information',
    userInfo,
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});