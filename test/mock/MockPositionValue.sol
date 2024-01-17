// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockPositionValue {
  uint256 usd;
  uint8 decimals;

  constructor(uint256 _usd, uint8 _decimals) {
    usd = _usd;
    decimals = _decimals;
  }

  function setUsd(uint256 _usd) external {
    usd = _usd;
  }

  function toUSD(uint256, uint256, address, address) external view returns(uint256 _usd, uint8 _decimals) {
    _usd = usd;
    _decimals = decimals;
  }
}
