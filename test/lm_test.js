const LM = artifacts.require("LeisureMeta");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LeisureMeta", function (/* accounts */) {
  it("expects to show valid total supply", async function () {
    const lm = await LM.deployed();
    const expected = 5_000_000_000 * 1e18;
    return assert(lm.totalSupply(), expected);
  });
});
