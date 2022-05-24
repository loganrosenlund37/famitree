const { aql } = require('arangojs');
const db = require('../../database/index');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query(aql`FOR u IN users FILTER u.username == ${username} RETURN { username: u.username, password: u.password }`);
    const result = await user.all();
    const correctUsername = result[0]?.username === username;
    const correctPassword = result[0]?.password === password;
    if (!correctUsername) return res.send('User not found.');
    if (!correctPassword) return res.send('Incorrect password.');
    return res.send(true);
  } catch (error) {
    return res.sendStatus(500);
  }
};

module.exports = {
  login,
};
