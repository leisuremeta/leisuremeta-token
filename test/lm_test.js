const LM = artifacts.require("LeisureMeta");
const Lock = artifacts.require("LeisureMetaTimeLock");
const fs = require('fs');
const daopoolAddress = fs.readFileSync(`${__dirname}/../.secret.daopool`).toString().trim();

contract("LeisureMeta", function (accounts) {
  it("expects to show valid total supply", async function () {
    const lm = await LM.deployed();
    const expected = 5_000_000_000n * BigInt(1e18);
    const actual = await lm.totalSupply();
    return assert.equal(BigInt(actual), expected);
  });

  it("expects to show balance of account 0 as 40% of total supply", async function () {
    const lm = await LM.deployed();
    const expected = 5_000_000_000n * BigInt(1e18) * 40n / 100n;
    const actual = await lm.balanceOf(accounts[0]);
    return assert.equal(BigInt(actual), expected);
  });
  
  it("expects to show balance of daopoolAddress 0 as 60% of total supply", async function () {
    const lm = await LM.deployed();
    const expected = 5_000_000_000n * BigInt(1e18) * 60n / 100n;
    const actual = await lm.balanceOf(daopoolAddress);
    return assert.equal(actual, expected);
  });

/*
  it("expects to show valid beneficiery of dao pool lock", async function () {
    const lm = await LM.deployed();
    const daoLockAddress = await lm.daoPoolLock();
    const daoLock = await Lock.at(daoLockAddress);
    const expected = daopoolAddress;
    const actual = await daoLock.beneficiary();
    return assert.equal(actual, daopoolAddress);
  });

  it("expects to show locked amount of dao pool lock as 1% of total supply", async function () {
    const lm = await LM.deployed();
    const daoLockAddress = await lm.daoPoolLock();
    const daoLock = await Lock.at(daoLockAddress);
    const expected = 5_000_000_000n * BigInt(1e18) / 100n;
    const actual = await daoLock.lockedAmount(0);
    return assert.equal(BigInt(actual), expected);
  });

  it("expects to show valid number of locked item of dao pool lock", async function () {
    const lm = await LM.deployed();
    const daoLockAddress = await lm.daoPoolLock();
    const daoLock = await Lock.at(daoLockAddress);
    const expected = 60;
    const actual = await daoLock.numberOfLockedItems();
    return assert.equal(actual.toNumber(), expected);
  });

  it("expects to show valid release time of the last item of dao pool lock", async function () {
    const lm = await LM.deployed();
    const daoLockAddress = await lm.daoPoolLock();
    const daoLock = await Lock.at(daoLockAddress);
    const lastIndex = await daoLock.numberOfLockedItems() - 1;
    const expected = 0;
    const actual = await daoLock.releaseTime(lastIndex);
    return assert.equal(actual.toNumber(), expected);
  });

  it("expects to show valid release time of the first item of dao pool lock", async function () {
    const lm = await LM.deployed();
    const daoLockAddress = await lm.daoPoolLock();
    const daoLock = await Lock.at(daoLockAddress);
    const expected = 59 * 30 * 24 * 3600;
    const actual = await daoLock.releaseTime(0);
    return assert.equal(actual.toNumber(), expected);
  });
  */
});
