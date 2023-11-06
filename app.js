const express = require('express');
const cache = require('memory-cache');
const app = express();

// Middleware for caching
function cacheMiddleware(req, res, next) {
  const key = req.originalUrl || req.url;

  const cachedData = cache.get(key);

  if (cachedData) {
    res.send(cachedData);
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.put(key, body, 10 * 1000); // Cache for 10 seconds
      res.sendResponse('ok');
    };
    next();
  }
}

app.use(cacheMiddleware);

app.get('/data', (req, res) => {
  // Simulate an expensive operation
  setTimeout(() => {
    res.send('Data from the server');
  }, 2000);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
