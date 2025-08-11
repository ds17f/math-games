const express = require('express');
const path = require('path');
const os = require('os');
const openModule = require('open');

// Create Express app
const app = express();
const PORT = 8000;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/games/dotgame', (req, res) => {
  res.sendFile(path.join(__dirname, 'games', 'dotgame', 'index.html'));
});

// Get local IP address
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  let localIP = '127.0.0.1';
  
  // Find a non-internal IPv4 address
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];
    
    interfaces.forEach((iface) => {
      // Skip internal and non-ipv4 interfaces
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
      }
    });
  });
  
  return localIP;
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  const localIP = getLocalIP();
  const localURL = `http://localhost:${PORT}`;
  const networkURL = `http://${localIP}:${PORT}`;
  
  console.log(`\nServing at:`);
  console.log(`- Local URL: ${localURL}`);
  console.log(`- Network URL (for external devices): ${networkURL}`);
  console.log(`\nUse the Network URL to access from any device when connected to the same WiFi`);
  console.log(`Note: Make sure your firewall allows incoming connections on port ${PORT}`);
  console.log(`\nPress Ctrl+C to stop the server`);
  
  // Open in browser
  try {
    openModule(localURL);
  } catch (err) {
    console.log('Could not open browser automatically, please open manually.');
  }
});