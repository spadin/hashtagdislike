exports.up = function(db) {
  return db.runSql(`
    CREATE TABLE dislikes_count (
      tweet_id BIGINT PRIMARY KEY,
      total INT
    );
 `);
};

exports.down = function(db) {
  return db.runSql('DROP TABLE dislikes_count;');
};
