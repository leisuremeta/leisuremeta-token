const LM = artifacts.require("LeisureMeta");
const { log } = require("console");
const fs = require("fs");
const daopoolAddress = fs
  .readFileSync(`${__dirname}/../.secret.daopool`)
  .toString()
  .trim();

const TOTAL_AMOUNT = 5_000_000_000n * BigInt(1e18);
const DAO_AMOUNT = (TOTAL_AMOUNT * 60n) / 100n;

contract("LeisureMeta", function (accounts) {
  it("전체.물량", async function () {
    const lm = await LM.deployed();
    const expected = TOTAL_AMOUNT;
    const actual = await lm.totalSupply();

    return assert.equal(BigInt(actual), expected);
  });

  it("전체.계좌", async function () {
    const lm = await LM.deployed();
    const expected = TOTAL_AMOUNT;
    const actual = await lm.balanceOf(accounts[0]);

    return assert.equal(BigInt(actual), expected);
  });

  it("daopool.계좌_lock지정,물량조회", async function () {
    const lm = await LM.deployed();
    const daoBalance = DAO_AMOUNT;
    await lm.daoLock(daopoolAddress, daoBalance);
    const actual = await lm.balanceOf(daopoolAddress);
    // log("actual", actual);
    // log("daoBalance", daoBalance);
    // log("daoBalance", actual == daoBalance);

    return assert.equal(actual, daoBalance);
  });

  it("daopool.계좌조회", async function () {
    const lm = await LM.deployed();
    const expected = daopoolAddress;
    const actual = await lm.daoLockAddress();

    return assert.equal(actual, expected);
  });

  it("daopool.locked_물량조회", async function () {
    const lm = await LM.deployed();
    const daoBalance = await lm.balanceOf(daopoolAddress);
    const expected = (TOTAL_AMOUNT * 57n) / 100n;
    const actual = await lm.lockedAmount(daopoolAddress);
    return assert.equal(actual, expected);
  });

  it("daopool.locked_아이템갯수조회", async function () {
    const lm = await LM.deployed();
    const expected = 60;
    const items = await lm.lockedItems(daopoolAddress);
    return assert.equal(items.length, expected);
  });

  it("세일락.계좌_lock지정,전체물량조회", async function () {
    const lm = await LM.deployed();
    const amount = BigInt(1e18) * 10000n;
    await lm.saleLock(accounts[1], amount);
    const balance = await lm.balanceOf(accounts[1]);

    return assert.equal(balance, amount);
  });

  it("세일락.locked_아이템_갯수조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);

    return assert.equal(items.length, 7);
  });

  it("세일락.locked_0번째_아이템_출시일조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);
    const expected = 10 * 30 * 24 * 3600;

    return assert.equal(items[0].releaseTime, expected);
  });

  it("세일락.locked_6번째_아이템_출시일조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);
    const expected = 4 * 30 * 24 * 3600;

    return assert.equal(items[6].releaseTime, expected);
  });

  it("세일락.locked_0번째_아이템_물량조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);
    const expected = (BigInt(1e18) * 10000n) / 7n;

    return assert.equal(items[0].amount, expected);
  });

  it("제너럴락.계좌_lock지정,전체물량조회", async function () {
    const lm = await LM.deployed();
    const generalLockAmount = BigInt(1e18) * 1000n;
    await lm.generalLock(accounts[2], generalLockAmount);
    const balance = await lm.balanceOf(accounts[2]);

    return assert.equal(balance, generalLockAmount);
  });

  it("제너럴락.locked_물량조회", async function () {
    const lm = await LM.deployed();
    const generalLockAmount = BigInt(1e18) * 1000n;
    const lockedAmount = await lm.lockedAmount(accounts[2]);

    return assert.equal(lockedAmount, generalLockAmount);
  });

  it("제너럴락.locked_아이템갯수조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);

    return assert.equal(items.length, 20);
  });

  it("제너럴락.locked_0번째_아이템출시일조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);
    const expected = 25 * 30 * 24 * 3600;

    return assert.equal(items[0].releaseTime, expected);
  });

  it("제너럴락.locked_19번째_아이템출시일조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);
    const expected = 6 * 30 * 24 * 3600;

    return assert.equal(items[19].releaseTime, expected);
  });

  it("제너럴락.locked_0번째_아이템물량조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);
    const expected = (BigInt(1e18) * 1000n) / 20n;

    return assert.equal(items[0].amount, expected);
  });

  // it("락업이후_트랜스퍼테스트", async function () {
  //   const lm = await LM.deployed();
  //   const from = daopoolAddress;
  //   const to = "0x58015d02487bb1182dbfbf381d305e9900cec0b2";
  //   const amount = web3.utils.toBN(1); // Convert amount to a big number

  //   // Step 1: Approve the transfer
  //   await lm.approve(to, amount, { from: from });

  //   // Step 2: Check the allowance
  //   const allowance = await lm.allowance(from, to);
  //   console.log(`Allowance from ${from} to ${to}: ${allowance.toString()}`);

  //   // Step 3: Perform the transfer
  //   await lm.transferFrom(from, to, amount, { from: to });

  //   // Step 4: Check the new balances
  //   const fromBalance = await lm.balanceOf(from);
  //   const toBalance = await lm.balanceOf(to);
  //   console.log(`New balance of ${from}: ${fromBalance.toString()}`);
  //   console.log(`New balance of ${to}: ${toBalance.toString()}`);
  // });

  it("세일락_리보크이후.리보크이후_전체물량조회", async function () {
    const lm = await LM.deployed();
    await lm.revoke(accounts[1]);
    const balance = await lm.balanceOf(accounts[1]);
    const expected = BigInt(1e18) * 10000n;

    return assert.equal(balance, expected);
  });

  it("세일락_리보크이후.리보크이후_locked_0번째_아이템_물량조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);
    const expected = (BigInt(1e18) * 10000n) / 7n;

    return assert.equal(items[0].amount, expected);
  });

  it("세일락_리보크이후.리보크이후_아이템_출시일조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);
    const expected = 10 * 30 * 24 * 3600;

    return assert.equal(items[0].releaseTime, expected);
  });

  it("세일락_리보크이후.리보크이후_아이템1개_물량조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.lockedItems(accounts[1]);
    const expected = (BigInt(1e18) * 10000n) / 7n;
    return assert.equal(items[0].amount, expected);
  });

  it("제너럴락_리보크이후.리보크이후_전체물량조회", async function () {
    const lm = await LM.deployed();
    await lm.revoke(accounts[2]);
    const balance = await lm.balanceOf(accounts[2]);

    return assert.equal(balance, 0);
  });

  it("제너럴락_리보크이후.리보크이후_locked_물량조회", async function () {
    const lm = await LM.deployed();
    const generalLockAmount = 0;
    const lockedAmount = await lm.lockedAmount(accounts[2]);

    return assert.equal(lockedAmount, generalLockAmount);
  });

  it("제너럴락_리보크이후.리보크이후_locked_아이템갯수조회", async function () {
    const lm = await LM.deployed();
    const items = await lm.revocablyLockedItems(accounts[2]);

    return assert.equal(items.length, 0);
  });

  it("포즈 테스트", async function () {
    const lm = await LM.deployed();
    await lm.pause();
    const isPaused = await lm.paused();

    return assert.equal(isPaused, true);
  });

  it("언포즈 테스트", async function () {
    const lm = await LM.deployed();
    await lm.unpause();
    const isPaused = await lm.paused();

    return assert.equal(isPaused, false);
  });

  it("오너쉽 트랜스퍼 테스트", async function () {
    const lm = await LM.deployed();
    await lm.transferOwnership(accounts[1]);
    const owner = await lm.owner();

    return assert.equal(owner, accounts[1]);
  });

  it("오너쉽 트랜스퍼 테스트", async function () {
    const lm = await LM.deployed();
    try {
      await lm.pause();
      return assert.fail();
    } catch (e) {}
    const isPaused = await lm.paused();

    return assert.equal(isPaused, false);
  });

  it("오너쉽 트랜스퍼 테스트", async function () {
    const lm = await LM.deployed();
    try {
      await lm.pause();
      return assert.fail();
    } catch (e) {}
    const isPaused = await lm.paused();

    return assert.equal(isPaused, false);
  });
});
