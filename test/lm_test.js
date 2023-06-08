const LM = artifacts.require("LeisureMeta");
const fs = require("fs");
const daopoolAddress = fs
  .readFileSync(`${__dirname}/../.secret.daopool`)
  .toString()
  .trim();

contract("LeisureMeta", function (accounts) {
  it("expects to show valid total supply", async function () {
    const lm = await LM.deployed();
    const expected = 5_000_000_000n * BigInt(1e18);
    const actual = await lm.totalSupply();

    return assert.equal(BigInt(actual), expected);
  });

  it("expects to show balance of account 0 as 100% of total supply", async function () {
    const lm = await LM.deployed();
    const expected = 5_000_000_000n * BigInt(1e18);
    const actual = await lm.balanceOf(accounts[0]);

    return assert.equal(BigInt(actual), expected);
  });

  it("expects to show valid balance of daopoolAddress after daoLock", async function () {
    const lm = await LM.deployed();
    const daoBalance = (5_000_000_000n * BigInt(1e18) * 60n) / 100n;
    await lm.daoLock(daopoolAddress, daoBalance);
    const actual = await lm.balanceOf(daopoolAddress);

    return assert.equal(actual, daoBalance);
  });

  it("expects to show valid beneficiery of dao pool lock", async function () {
    const lm = await LM.deployed();
    const expected = daopoolAddress;
    const actual = await lm.daoLockAddress();

    return assert.equal(actual, expected);
  });

  it("expects to show locked amount of dao pool lock as 57% of total supply", async function () {
    const lm = await LM.deployed();
    const daoBalance = await lm.balanceOf(daopoolAddress);
    const expected = (5_000_000_000n * BigInt(1e18) * 57n) / 100n;
    const actual = await lm.lockedAmount(daopoolAddress);
//    console.log("daoBalance", web3.utils.toBN(actual).toString());
    return assert.equal(actual, expected);
  });

  it("expects to show valid number of locked item of dao pool lock", async function () {
    const lm = await LM.deployed();
    const expected = 60;
    const items = await lm.lockedItems(daopoolAddress);

//    console.log("Locked Items: ", items);
//    console.log("Current Time: ", Math.floor(Date.now() / 1000));
    return assert.equal(items.length, expected);
  });

//  it("expects to show valid release time of the last item of dao pool lock", async function () {
//    const lm = await LM.deployed();
//    const items = await lm.lockedItems(daopoolAddress);
//    const expected = 30 * 24 * 3600;
//    const actual = items[items.length - 1].releaseTime;
//
//    return assert.equal(actual, expected);
//  });

//  it("expects to show valid release time of the first item of dao pool lock", async function () {
//    const lm = await LM.deployed();
//    const items = await lm.lockedItems(daopoolAddress);
//    const expected = 60 * 30 * 24 * 3600;
//    const actual = items[0].releaseTime;
//
//    return assert.equal(actual, expected);
//  });

  it("expects to show valid balance after salesLock", async function () {
    const lm = await LM.deployed();
    const amount = BigInt(1e18) * 10000n;
    await lm.saleLock(accounts[1], amount);
    const balance = await lm.balanceOf(accounts[1]);

    return assert.equal(balance, amount);
  });

//  it("expects to show valid locked amount after salesLock", async function () {
//    const lm = await LM.deployed();
//    const amount = BigInt(1e18) * 10000n;
//    const lockedAmount = await lm.lockedAmount(accounts[1]);
//
//    return assert.equal(lockedAmount, amount);
//  });

  it("expects to show valid number of locked items after salesLock", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);

    return assert.equal(items.length, 7);
  });

//  it("expects to show valid release time of locked item #10 after salesLock", async function () {
//    const lm = await LM.deployed();
//    const items = await lm.lockedItems(accounts[1]);
//
//    return assert.equal(items[7].releaseTime, 0);
//  });

  it("expects to show valid release time of locked item #0 after salesLock", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);
    const expected = 10 * 30 * 24 * 3600;

    return assert.equal(items[0].releaseTime, expected);
  });

  it("expects to show valid balance after generalLock", async function () {
    const lm = await LM.deployed();
    const generalLockAmount = BigInt(1e18) * 1000n;
    await lm.generalLock(accounts[2], generalLockAmount);
    const balance = await lm.balanceOf(accounts[2]);

    return assert.equal(balance, generalLockAmount);
  });

  it("expects to show valid locked amount after generalLock", async function () {
    const lm = await LM.deployed();
    const generalLockAmount = BigInt(1e18) * 1000n;
    const lockedAmount = await lm.lockedAmount(accounts[2]);

    return assert.equal(lockedAmount, generalLockAmount);
  });

  it("expects to show valid number of revocably locked items after generalLock", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);

    return assert.equal(items.length, 20);
  });

  it("expects to show valid release time of locked item #19 after generalLock", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);
    const expected = 6 * 30 * 24 * 3600;

    return assert.equal(items[19].releaseTime, expected);
  });

  it("expects to show valid release time of locked item #0 after generalLock", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);
    const expected = 25 * 30 * 24 * 3600;

    return assert.equal(items[0].releaseTime, expected);
  });

  it("expects to show valid balance after revoke from account #1", async function () {
    const lm = await LM.deployed();
    await lm.revoke(accounts[1]);
    const balance = await lm.balanceOf(accounts[1]);
    const expected = BigInt(1e18) * 10000n;

    return assert.equal(balance, expected);
  });

  it("expects to show valid balance after revoke from account #2", async function () {
    const lm = await LM.deployed();
    await lm.revoke(accounts[2]);
    const balance = await lm.balanceOf(accounts[2]);

    return assert.equal(balance, 0);
  });
});
