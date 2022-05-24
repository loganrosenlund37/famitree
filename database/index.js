const Arango = require('arangojs');
const {
  username, password, database, URL,
} = require('./dbAuth');

const db = new Arango(URL);

db.useDatabase(database);
db.useBasicAuth(username, password);

module.exports = db;
