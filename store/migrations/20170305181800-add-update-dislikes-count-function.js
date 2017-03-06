exports.up = function(db) {
  return db.runSql(`
    CREATE FUNCTION update_dislikes_count() RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO dislikes_count (tweet_id, total)
          VALUES (NEW.tweet_id, 1)
          ON CONFLICT (tweet_id) DO
            UPDATE SET total = dislikes_count.total + 1
              WHERE dislikes_count.tweet_id = NEW.tweet_id;
        RETURN NEW;
      END;
    $$ LANGUAGE plpgsql;
 `);
};

exports.down = function(db) {
  return db.runSql('DROP FUNCTION update_dislikes_count();');
};
