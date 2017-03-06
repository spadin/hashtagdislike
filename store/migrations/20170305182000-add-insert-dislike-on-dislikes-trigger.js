exports.up = function(db) {
  return db.runSql(`
    CREATE TRIGGER insert_dislike
      AFTER INSERT ON dislikes
      FOR EACH ROW
      EXECUTE PROCEDURE update_dislikes_count();
  `);
};

exports.down = function(db) {
  return db.runSql('DROP TRIGGER insert_dislike ON dislikes;');
};
