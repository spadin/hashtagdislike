function config() {
  return {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
  }
}
const pg = require('pg');
const pool = new pg.Pool(config());

function query(fn) {
  pool.connect((err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    fn(client, done);
  });
}

module.exports = {
  query,
};
