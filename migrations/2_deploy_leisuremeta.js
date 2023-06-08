const LM = artifacts.require('LeisureMeta');
const fs = require('fs');
const daopoolAddress = fs.readFileSync(`${__dirname}/../.secret.daopool`).toString().trim();
const initialDDay = 1677120000; // 2023-02-23 02:40:00 GMT


module.exports = async function (deployer) {
  await deployer.deploy(LM, daopoolAddress, initialDDay);
};
