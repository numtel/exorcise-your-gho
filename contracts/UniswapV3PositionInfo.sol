// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import "v3-core/contracts/libraries/TickMath.sol";
import "v3-core/contracts/libraries/FullMath.sol";
import "v3-core/contracts/libraries/SqrtPriceMath.sol";
import "./INonfungiblePositionManager.sol";
import "./IUniswapV3Pool.sol";

// Some from ChatGPT4, some from uniswap core contracts
contract UniswapV3PositionInfo {

    INonfungiblePositionManager public positionManager;

    constructor(address _positionManager) {
        positionManager = INonfungiblePositionManager(_positionManager);
    }

    // Square root of 1.0001 as a Q64.96
    uint160 private constant sqrtPricePrecision = 79228162514264337593543950336;

    function getPositionAmounts(uint256 tokenId, address poolAddress) 
        external 
        view 
        returns (uint256 amount0, uint256 amount1, address token0, address token1)
    {
        INonfungiblePositionManager.Position memory position = positionManager.positions(tokenId);
        token0 = position.token0;
        token1 = position.token1;

        IUniswapV3Pool pool = IUniswapV3Pool(poolAddress);

        (uint160 sqrtPriceX96, int24 tick,,,,,) = pool.slot0();

        if (tick < position.tickLower) {
            // current tick is below the passed range; liquidity can only become in range by crossing from left to
            // right, when we'll need _more_ token0 (it's becoming more valuable) so user must provide it
            amount0 = SqrtPriceMath.getAmount0Delta(
                TickMath.getSqrtRatioAtTick(position.tickLower),
                TickMath.getSqrtRatioAtTick(position.tickUpper),
                position.liquidity, false
            );
        } else if (tick < position.tickUpper) {
            amount0 = SqrtPriceMath.getAmount0Delta(
                sqrtPriceX96,
                TickMath.getSqrtRatioAtTick(position.tickUpper),
                position.liquidity, false
            );
            amount1 = SqrtPriceMath.getAmount1Delta(
                TickMath.getSqrtRatioAtTick(position.tickLower),
                sqrtPriceX96,
                position.liquidity, false
            );
        } else {
            // current tick is above the passed range; liquidity can only become in range by crossing from right to
            // left, when we'll need _more_ token1 (it's becoming more valuable) so user must provide it
            amount1 = SqrtPriceMath.getAmount1Delta(
                TickMath.getSqrtRatioAtTick(position.tickLower),
                TickMath.getSqrtRatioAtTick(position.tickUpper),
                position.liquidity, false
            );
        }
    }
}

