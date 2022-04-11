// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract LeisureMeta is ERC20Burnable, Ownable, Pausable {
    using SafeERC20 for LeisureMeta;
    address public immutable daoLockAddress;
    uint256 private _dDay;

    mapping(address => LockedItem[]) private _lockedItems;

    mapping(address => LockedItem[]) private _rovocablyLockedItems;

    struct LockedItem {
        uint256 amount;
        uint256 releaseTime;
    }

    event SetDDay(uint256 dDay);
    event SalesLock(address indexed beneficiary, uint256 totalAmount);
    event GeneralLock(address indexed beneficiary, uint256 totalAmount);
    event Revoke(address indexed from, uint256 amount, uint256 revokeTime);

    constructor(address daopool, uint256 initialDDay)
        ERC20("LeisureMeta", "LM")
    {
        require(daopool != address(0), "LeisureMeta: daopool is zero address");
        uint256 totalAmount = 5_000_000_000 * (10**uint256(decimals()));
        uint256 sixtyPercent = (totalAmount * 60) / 100;
        uint256 fortyPercent = (totalAmount * 40) / 100;

        _dDay = initialDDay;
        daoLockAddress = daopool;

        _mint(daopool, sixtyPercent);
        daoLock(daopool, sixtyPercent);
        _mint(_msgSender(), fortyPercent);
    }

    /**
     * @dev See {ERC20-_beforeTokenTransfer}.
     *
     * Requirements:
     *
     * - the contract must not be paused.
     * - the sender have enough unlocked tokens to transfer.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        require(!paused(), "ERC20Pausable: token transfer while paused");
    }

    function _transfer(address from, address to, uint256 amount) override internal {
        require(
            balanceOf(from) > lockedAmount(from) + amount,
            "ERC20: insufficient balance"
        );

        clearUnnessaryLockedItems(from);
        super._transfer(from, to, amount);
    }

    /**
     * @dev Set D-Day which might be the first day of listing in major crypto exchanges.
     */
    function setDDay(uint256 dDay) external onlyOwner {
        require(dDay > block.timestamp, "D-Day must be in the future");
        _dDay = dDay;
        emit SetDDay(_dDay);
    }

    function getDDay() external view returns (uint256) {
        return _dDay;
    }

    function lockedItem(address beneficiary)
        external
        view
        returns (LockedItem[] memory)
    {
        return _lockedItems[beneficiary];
    }

    function revokableLockedItem(address beneficiary)
        external
        view
        returns (LockedItem[] memory)
    {
        return _rovocablyLockedItems[beneficiary];
    }

    function lockedAmount(address beneficiary) public view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < _lockedItems[beneficiary].length; i++) {
            LockedItem storage item = _lockedItems[beneficiary][i];
            if (_dDay + item.releaseTime < block.timestamp) total += item.amount;
        }
        for (
            uint256 i = 0;
            i < _rovocablyLockedItems[beneficiary].length;
            i++
        ) {
            LockedItem storage item = _rovocablyLockedItems[beneficiary][i];
            if (_dDay + item.releaseTime < block.timestamp) total += item.amount;
        }
        return total;
    }

    function clearUnnessaryLockedItems(address from) public {
        while (
            _lockedItems[from].length > 0 &&
            _dDay + _lockedItems[from][0].releaseTime < block.timestamp
        ) {
            _lockedItems[from].pop();
        }
        while (
            _rovocablyLockedItems[from].length > 0 &&
            _dDay + _rovocablyLockedItems[from][0].releaseTime < block.timestamp
        ) {
            _rovocablyLockedItems[from].pop();
        }

        if (_lockedItems[from].length == 0) delete _lockedItems[from];
        if (_rovocablyLockedItems[from].length == 0)
            delete _rovocablyLockedItems[from];
    }

    function daoLock(address beneficiary, uint256 amount)
        internal
        onlyOwner
        returns (bool)
    {
        uint256 aDay = 24 * 3600;
        for (uint256 i = 0; i < 60; i++) {
            _lockedItems[beneficiary].push(LockedItem({
                amount: amount / 60,
                releaseTime: 30 * aDay * (60 - i - 1)
            }));
        }
        return true;
    }

    function saleLock(address beneficiary, uint256 amount)
        external
        onlyOwner
        returns (bool)
    {
        uint256 aDay = 24 * 3600;
        for (uint256 i = 0; i < 9; i++) {
            _lockedItems[beneficiary].push(LockedItem({
                amount: amount / 10,
                releaseTime: 30 * aDay * (11 - i)
            }));
        }
        _lockedItems[beneficiary].push(LockedItem({
            amount: (amount * 9) / 100,
            releaseTime: 30 * aDay
        }));
        _lockedItems[beneficiary].push(LockedItem({
            amount: amount / 100,
            releaseTime: 0
        }));
        emit SalesLock(beneficiary, amount);
        return true;
    }

    function generalLock(address beneficiary, uint256 amount)
        external
        onlyOwner
        returns (bool)
    {
        uint256 aDay = 24 * 3600;
        for (uint256 i = 0; i < 20; i++) {
            _lockedItems[beneficiary].push(LockedItem({
                amount: amount / 20,
                releaseTime: 30 * aDay * (25 - i)
            }));
        }
        emit GeneralLock(beneficiary, amount);
        return true;
    }

    function revoke(address from) external onlyOwner {
        uint256 lockedTotal = 0;
        LockedItem[] storage items = _rovocablyLockedItems[from];
        while (items.length > 0) {
            if (_dDay + items[items.length - 1].releaseTime < block.timestamp) {
                lockedTotal += items[items.length - 1].amount;
            }
            items.pop();
        }
        delete _rovocablyLockedItems[from];
        emit Revoke(from, lockedTotal, block.timestamp);
        this.safeTransfer(from, lockedTotal);
    }
}
