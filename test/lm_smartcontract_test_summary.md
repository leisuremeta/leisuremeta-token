```js

전체{
  물량: (5_000_000_000n * BigInt(1e18))
  계좌: accounts[0]
}

daopool {
  계좌_lock지정 : lm.daoLock(daopoolAddress, daoBalance)
  물량조회: lm.balanceOf(daopoolAddress) == 전체의 60%
  계좌조회: lm.daoLockAddress() == daopoolAddress
  locked_물량조회 : lm.lockedAmount(daopoolAddress) == 전체의 57%
  locked_아이템갯수조회 : lm.lockedItems(daopoolAddress).length == 60
}

세일락 {
  계좌_lock지정: lm.saleLock(accounts[1], amount)
  전체물량조회 : lm.balanceOf(accounts[1]) == BigInt(1e18) * 10000n
  locked_아이템_갯수조회 : lm.lockedItems(accounts[1]).length == 7
  locked_0번째_아이템_출시일조회 : lm.lockedItems(accounts[1])[0].releaseTime == 10 * 30 * 24 * 3600
  locked_6번째_아이템_출시일조회 : lm.lockedItems(accounts[1])[6].releaseTime == 4 * 30 * 24 * 3600
  locked_0번째_아이템_물량조회 : lm.lockedItems(accounts[1])[0].amount == BigInt(1e18) * 10000n / 7n
}

세일락_리보크이후 {
  리보크실행 : lm.revoke(accounts[1])
  리보크이후_전체물량조회 : lm.balanceOf(accounts[1]) == BigInt(1e18) * 10000n
  리보크이후_locked_0번째_아이템_물량조회 : lm.lockedItems(accounts[1])[0].amount == BigInt(1e18) * 10000n / 7n
  리보크이후_locked_0번째_아이템_물량조회 : lm.lockedItems(accounts[1])[0].releaseTime == 10 * 30 * 24 * 3600
}

제너럴락 {
  계좌_lock지정: lm.generalLock(accounts[2], generalLockAmount)
  전체물량조회 : lm.balanceOf(accounts[2]) == BigInt(1e18) * 1000n
  locked_물량조회 : lm.lockedAmount(accounts[2]) == BigInt(1e18) * 1000n
  locked_아이템갯수조회 : lm.revocablyLockedItems(accounts[2]).length == 20
  locked_0번째_아이템출시일조회 : lm.revocablyLockedItems(accounts[2])[0].releaseTime == 25 * 30 * 24 * 3600
  locked_19번째_아이템출시일조회 : lm.revocablyLockedItems(accounts[2])[19].releaseTime == 6 * 30 * 24 * 3600
  locked_0번째_아이템물량조회 : lm.revocablyLockedItems(accounts[2])[0].amount == BigInt(1e18) * 1000n / 20n
}

// TODO. 3번 테스트 추가 -- 미완료
락업_테스트 {
  락업이후_트랜스퍼테스트: 현재 날짜기준 3/60 까지 트랜스퍼 가능?
  락업이후_트랜스퍼테스트: [수정된 날짜 기준] 10/60 까지 트랜스퍼 가능?
  락업이후_트랜스퍼테스트: [수정된 날짜 기준] 60/60 까지 트랜스퍼 가능?
}

제너럴락_리보크이후 {
  리보크실행 : lm.revoke(accounts[2])
  리보크이후_전체물량조회 : lm.balanceOf(accounts[2]) == 0
  리보크이후_locked_물량조회 : lm.lockedAmount(accounts[2]) == 0
  리보크이후_locked_아이템갯수조회 : lm.revocablyLockedItems(accounts[2]).length == 0
}

포즈/언포즈 테스트 {
  포즈: lm.pause()
  포즈_이후: await lm.paused() == true
  언포즈: lm.unpause()
  언포즈_이후: await lm.paused() == false
}


오너쉽 트랜스퍼 테스트{
  트랜스퍼오너 : lm.transferOwnership(accounts[1])
  트랜스퍼오너_이후_소유주 : lm.owner() == accounts[1]
  트랜스퍼오너_이후 : await lm.paused() == 에러발생! // 실행 불가 : caller is not the owner
}

```
