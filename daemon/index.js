require('dotenv').config();

const Twitter = require('twitter');
const _ = require('lodash');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const isTweet = _.conforms({
	id_str: _.isString,
	text: _.isString,
  entities: _.isObject,
});

const containsHashtag = (text, {entities: {hashtags}}) => (hashtags.include(text))
const dislike = require('./dislike');

function watch({text, timeout}) {
  return new Promise((resolve, reject) => {
    client.stream('statuses/filter', {track: text}, function(stream) {
      stream.on('data', function(event) {
        if(isTweet(event) && containsHashtag(text, event) && event.in_reply_to_status_id_str) {
          const tweetId = event.in_reply_to_status_id_str;
          const userId = event.user.id;
          dislike(tweetId, userId);
        }
      });

      stream.on('error', function(error) {
        const is401 = error.toString().includes('401');
        console.log('ERROR **** ERROR **** ERROR **** ERROR ****');
        console.log(error);

        if(is401) {
          if(timeout === 0) {
            resolve(5000);
          }
          else {
            resolve(timeout * 2);
          }
        }
        else {
          if(timeout === 0) {
            resolve(60000);
          }
          else {
            resolve(timeout * 2);
          }
        }
      });
    });
  });
}

function connect(timeout) {
  return watch({text: '#dislike', timeout});
}

function run(timeout) {
  return new Promise((resolve, reject) => {
    console.log(`Connecting in ${timeout}ms...`);
    setTimeout(async () => {
      resolve(await connect(timeout));
    }, timeout);
  });
}

async function continously(fn, timeout = 0) {
  continously(fn, await fn(timeout));
}

continously(run);
