// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import "../contracts/UniswapV3PositionInfo.sol";
import "./mock/MockNonfungiblePositionManager.sol";
import "./mock/MockUniswapV3Pool.sol";
import "forge-std/Test.sol";

// From ChatGPT4, except position #37 data
contract UniswapV3PositionInfoTest is Test {
    MockNonfungiblePositionManager positionManager;
    MockUniswapV3Pool pool;
    UniswapV3PositionInfo positionInfo;

    function setUp() public {
        positionManager = new MockNonfungiblePositionManager();
        pool = new MockUniswapV3Pool();
        positionInfo = new UniswapV3PositionInfo(address(positionManager));

        // Set up mock position
        // https://etherscan.io/tx/0x89d75075eaef8c21ab215ae54144ba563b850ee7460f89b2a175fd0e267ed330#eventlog
        INonfungiblePositionManager.Position memory mockPosition = INonfungiblePositionManager.Position({
            nonce: 0,
            operator: address(this),
            token0: address(1), // Replace with actual token0 address
            token1: address(2), // Replace with actual token1 address
            fee: 3000,
            tickLower: 192180,
            tickUpper: 193380,
            liquidity: 10860507277202,
            feeGrowthInside0LastX128: 0,
            feeGrowthInside1LastX128: 0,
            tokensOwed0: 500,
            tokensOwed1: 1000
        });
        positionManager.setPosition(mockPosition);

        // Set up mock pool state
        uint160 sqrtPriceX96 = 1623707776597596587242115200793787; // Example sqrt price
        int24 tick = 198567; // Example tick
        pool.setSlot0(sqrtPriceX96, tick);
    }

    function testGetPositionAmounts() public {
        uint256 tokenId = 1; // Example NFT token ID

        // Call the function and assert results
        (uint256 amount0, uint256 amount1) = positionInfo.getPositionAmounts(tokenId, address(pool));

        // Assert the expected amounts (replace these with expected values)
        assertEq(amount0, 0); // Example expected amount for token0
        assertEq(amount1, 9999999999999133); // Example expected amount for token1
    }
}

