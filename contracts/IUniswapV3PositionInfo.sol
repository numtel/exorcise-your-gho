// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapV3PositionInfo {
    function getPositionAmounts(uint256 tokenId, address poolAddress) 
        external 
        view 
        returns (uint256 amount0, uint256 amount1, address token0, address token1);
}
