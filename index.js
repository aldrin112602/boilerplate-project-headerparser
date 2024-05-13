require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const validUrl = require('valid-url');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Map to store original URLs and their corresponding short URLs
const urlMap = new Map();
let nextShortUrlId = 1;

// Endpoint for shortening URLs
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Check if the URL is valid
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate short URL
  const shortUrl = nextShortUrlId++;

  // Store the mapping of original URL to short URL
  urlMap.set(shortUrl, originalUrl);

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint for redirecting to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = req.params.short_url;
  
  // Retrieve the original URL from the map
  const originalUrl = urlMap.get(parseInt(shortUrl));

  if (!originalUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  res.redirect(originalUrl);
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
