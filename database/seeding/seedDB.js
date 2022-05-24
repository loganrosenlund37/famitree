/* eslint-disable */
const db = require('../index');
const faker = require('faker');
const { getAge, getSpouse, getSiblings, getChildren } = require('./utilities');

db.collection('leafs').truncate();
db.collection('relations').truncate();

let total = 0;
let leafs = [];

while(total > 0) {
  let leaf = {
    name: faker.name.findName(),
    age: getAge(),
    spouse: getSpouse(),
    birthday: faker.date.past(),
    father: faker.name.findName(),
    mother: faker.name.findName(),
    siblings: getSiblings(),
    children: getChildren(),
  };
  leafs.push(leaf);
  total--;
};

db.collection('leafs').import(leafs).then(
  result => console.log('Import complete:', result),
  error => console.error('Import failed:', error)
)
