/* eslint-disable import/no-extraneous-dependencies */
const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = 3000;

const { login } = require('./controllers/UserController');
const {
  getLeafs,
  getLeaf,
  addLeaf,
  editLeaf,
  addSpouseOrParent,
  searchLeafs,
  removeLeaf,
} = require('./controllers/LeafController');

app.use(morgan('dev'));
app.use([bodyParser.json(), compression()]);
app.use(express.static('public'));

app.get(['/settings', '/leaf'], (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

app.get('/api/leafs', getLeafs);
app.get('/api/leaf', getLeaf);
app.get('/api/leafs/search', searchLeafs);

app.post('/api/login', login);
app.post('/api/leaf/new', addLeaf);
app.post('/api/leaf/spouseparent', addSpouseOrParent);

app.put('/api/leaf/edit', editLeaf);

app.delete('/api/leaf/remove', removeLeaf);

app.listen(PORT, () => {
  console.log(`Famitree server listening on port ${PORT}`);
});
