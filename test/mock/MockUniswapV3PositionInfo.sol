// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockUniswapV3PositionInfo {
  address public positionManager;
  uint256 amount0;
  uint256 amount1;
  address token0;
  address token1;

  constructor(
    uint256 _amount0,
    uint256 _amount1,
    address _token0,
    address _token1,
    address _positionManager
  ) {
    amount0 = _amount0;
    amount1 = _amount1;
    token0 = _token0;
    token1 = _token1;
    positionManager = _positionManager;
  }

  function getPositionAmounts(uint256) 
      external 
      view 
      returns (uint256 _amount0, uint256 _amount1, address _token0, address _token1)
  {
    _amount0 = amount0;
    _amount1 = amount1;
    _token0 = token0;
    _token1 = token1;
  }
}
