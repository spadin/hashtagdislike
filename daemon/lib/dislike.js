const { query } = require('./store');

function dislike(tweetId, userId) {
  return new Promise((resolve, reject) => {
    query((client, done) => {
      client.query('INSERT INTO dislikes (tweet_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;', [tweetId, userId], function(err, result) {
        done(err);

        if(err) {
          return console.error('error running query', err);
          reject(err);
        }
        else {
          resolve(true);
        }
      });
    });
  });
}

module.exports = dislike;
