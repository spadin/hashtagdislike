require('dotenv').config();

const fs = require('fs');
const https = require('https');
const url = require('url');
const total = require('./lib/total');
const html = fs.readFileSync('./index.html');

async function handler(request, response) {
  const path = url.parse(request.url).pathname;
  if(path.startsWith("/dislikes/")) {
    try {
      const tweetId = path.replace("/dislikes/", "");
      const tweetIdTotal = await total(tweetId);
      const data = { total: tweetIdTotal, tweetId };
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
      response.end(JSON.stringify(data));
    }
    catch(e) {
      console.log(e);
      response.writeHead(500);
      response.end();
    }
  }
  else {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    });
    response.end(html);
  }
}

const options = {
  key: fs.readFileSync('/private/hashtagdislike.com.key'),
  cert: fs.readFileSync('/private/hashtagdislike.com.crt'),
};

const server = https.createServer(options, handler);
server.listen(process.env.HTTPS_PORT, '0.0.0.0');
