/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');

const getAge = () => Math.round(Math.random() * 90) + 10;

const getSpouse = () => (Math.round(Math.random() * 10) % 2 ? null : faker.name.findName());

const getSiblings = () => {
  let siblingsCount = Math.round(Math.random() * 10);
  const siblings = [];

  while (siblingsCount > 0) {
    siblings.push(faker.name.findName());
    siblingsCount -= 1;
  }

  return siblings;
};

const getChildren = () => {
  let childrenCount = Math.round(Math.random() * 7);
  const children = [];

  while (childrenCount > 0) {
    children.push(faker.name.findName());
    childrenCount -= 1;
  }

  return children;
};

module.exports = {
  getAge,
  getSpouse,
  getSiblings,
  getChildren,
};
