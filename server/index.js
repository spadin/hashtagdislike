require('dotenv').config();

const http = require('http');
const url = require('url');
const total = require('./total');

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
    response.writeHead(404);
    response.end();
  }
}
const server = http.createServer(handler);
server.listen(process.env.HTTP_PORT, '0.0.0.0');
