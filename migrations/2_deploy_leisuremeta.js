const LM = artifacts.require('LeisureMeta');
const fs = require('fs');
const daopoolAddress = fs.readFileSync(`${__dirname}/../.secret.daopool`).toString().trim();
const initialDDay = 1798761600; // 2027-01-01 00:00:00 GMT


module.exports = async function (deployer) {
  await deployer.deploy(LM, daopoolAddress, initialDDay);
};
