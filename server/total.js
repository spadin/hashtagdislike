const { query } = require('../store');

function total(tweetId) {
  return new Promise((resolve, reject) => {
    if(!Number.isInteger(Number(tweetId))) {
      reject('tweetId is not a number');
      return;
    }
    query((client, done) => {
      client.query('SELECT total from dislikes_count WHERE tweet_id = $1', [tweetId], function(err, result) {
        done(err);

        if(err) {
          return console.error('error running query', err);
          reject(err);
        }

        if(result.rows.length > 0) {
          resolve(result.rows[0].total);
        }
        else {
          resolve(0);
        }
      });
    });
  });
}

module.exports = total;
