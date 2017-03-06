require('dotenv').config();

const Twitter = require('twitter');
const isTweet = require('./lib/isTweet');
const isReply = require('./lib/isReply');
const dislike = require('./lib/dislike');
const containsHashtag = require('./lib/containsHashtag');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const UNAUTHORIZED = Symbol('unauthorized');
const RATE_LIMITED = Symbol('rate-limited');
const UNKNOWN_HTTP = Symbol('unknown-http');
const UNKNOWN = Symbol('unknown');

function watchHashtag({text}) {
  return new Promise((_, reject) => {
    client.stream('statuses/filter', {track: `#${text}`}, function(stream) {
      stream.on('data', function(data) {
        if(isTweet(data) && isReply(data) && containsHashtag(text, data)) {
          const tweetId = data.in_reply_to_status_id_str;
          const userId = data.user.id;
          console.log('Saving dislike:', tweetId, userId);
          dislike(tweetId, userId);
        }
      });

      stream.on('error', function(error) {
        const is401 = error.toString().includes('401');
        const is420 = error.toString().includes('420');
        const isHttp = error.toString().includes('Status Code');

        if(is401) { reject({reason: UNAUTHORIZED}); }
        if(is420) { reject({reason: RATE_LIMITED}); }
        if(isHttp) { reject({reason: UNKNOWN_HTTP}); }

        reject({reason: UNKNOWN});
      });
    });
  });
}

function run() {
  return watchHashtag({text: 'dislike'});
}

function nextTimeoutForReason(reason, lastTimeout) {
  if(lastTimeout === 0) {
    const initialTimeout = {
      [UNKNOWN_HTTP]: 250,
      [UNKNOWN]: -1,
      [UNAUTHORIZED]: 1000,
      [RATE_LIMITED]: 5000,
    }[reason];

    return initialTimeout;
  }
  else {
    const nextTimeout = {
      [UNKNOWN_HTTP]: (lastTimeout + 250 > 16000) ? lastTimeout : (lastTimeout + 250),
      [UNKNOWN]: -1,
      [UNAUTHORIZED]: (lastTimeout * 2 > 320000) ? lastTimeout : (lastTimeout * 2),
      [RATE_LIMITED]: lastTimeout * 2,
    }[reason];

    return nextTimeout;
  }
}

let timeoutId = null;
async function continously(fn, lastTimeout = 0) {
  try {
    await fn();
  }
  catch(e) {
    console.log('Catch error in continously:', e);
    const { reason } = e || {reason: UNKNOWN};
    const timeout = nextTimeoutForReason(reason, lastTimeout);
    console.log('nextTimeoutForReason:', timeout);

    if(timeout >= 0) {
      clearInterval(timeoutId);
      timeoutId = setTimeout(async () =>  {
        await continously(fn, timeout);
      }, timeout);
    }
  }
}

continously(run);
