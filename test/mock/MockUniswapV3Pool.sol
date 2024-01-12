// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;

import "../../contracts/IUniswapV3Pool.sol";

// From ChatGPT4
contract MockUniswapV3Pool is IUniswapV3Pool {
    uint160 private sqrtPriceX96;
    int24 private tick;

    function setSlot0(uint160 _sqrtPriceX96, int24 _tick) public {
        sqrtPriceX96 = _sqrtPriceX96;
        tick = _tick;
    }

    function slot0() external view override returns (
        uint160, int24, uint16, uint16, uint16, uint8, bool
    ) {
        return (sqrtPriceX96, tick, 0, 0, 0, 0, true);
    }

    // Implement other required functions...
}
