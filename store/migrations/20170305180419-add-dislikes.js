exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE dislikes (
      tweet_id BIGINT NOT NULL,
      user_id BIGINT NOT NULL,
      PRIMARY KEY(tweet_id, user_id)
    );
 `);
};

exports.down = function(db) {
  return db.runSql('DROP TABLE dislikes;');
};
