// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPositionValue {
  function toUSD(uint256 amount0, uint256 amount1, address token0, address token1) external view returns(uint256 usd, uint8 decimals);
}

