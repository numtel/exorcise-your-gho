// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IChainlinkFeed.sol";
import "./IPositionValue.sol";

contract PositionValue is IPositionValue {
  error LENGTH_MISMATCH();
  error UNKNOWN_TOKEN();

  mapping(address => address) public priceFeeds;

  constructor(address[] memory knownTokens, address[] memory chainlinkFeeds) {
    if(knownTokens.length == 0 || knownTokens.length != chainlinkFeeds.length)
      revert LENGTH_MISMATCH();

    for(uint256 i = 0; i < knownTokens.length; i++) {
      priceFeeds[knownTokens[i]] = chainlinkFeeds[i];
    }
  }
  function toUSD(uint256 amount0, uint256 amount1, address token0, address token1) external view returns(uint256 usd, uint8 decimals) {
    if(priceFeeds[token0] == address(0) || priceFeeds[token1] == address(0))
      revert UNKNOWN_TOKEN();

    IChainlinkFeed feed0 = IChainlinkFeed(priceFeeds[token0]);
    IChainlinkFeed feed1 = IChainlinkFeed(priceFeeds[token1]);
    uint8 feedDecimals0 = feed0.decimals();
    uint8 feedDecimals1 = feed1.decimals();
    if(feedDecimals0 != feedDecimals1)
      revert LENGTH_MISMATCH();

    uint8 decimals0 = IERC20decimals(token0).decimals();
    uint8 decimals1 = IERC20decimals(token1).decimals();
    uint256 price0 = amount0 * uint256(feed0.latestAnswer());
    uint256 price1 = amount1 * uint256(feed1.latestAnswer());

    if(decimals0 > decimals1) {
      decimals = decimals0 + feedDecimals0;
      price1 *= 10 ** (decimals0 - decimals1);
    } else if(decimals1 > decimals0) {
      decimals = decimals1 + feedDecimals0;
      price0 *= 10 ** (decimals1 - decimals0);
    } else {
      // They're the same
      decimals = decimals0 + feedDecimals0;
    }
    usd = price0 + price1;
  }
}

interface IERC20decimals {
  function decimals() external view returns(uint8);
}
