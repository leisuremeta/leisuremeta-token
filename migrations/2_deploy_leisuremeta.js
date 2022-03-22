const LM = artifacts.require('LeisureMeta');
const fs = require('fs');
const daopoolAddress = fs.readFileSync(`${__dirname}/../.secret.daopool`).toString().trim();

module.exports = async function (deployer) {
  await deployer.deploy(LM, daopoolAddress);
};
