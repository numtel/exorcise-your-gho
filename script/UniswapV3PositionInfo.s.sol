// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import {Script, console2} from "forge-std/Script.sol";
import "../contracts/UniswapV3PositionInfo.sol";

// forge script script/UniswapV3PositionInfo.s.sol:TestScript --rpc-url https://rpc.ankr.com/eth_sepolia -vvvv
contract TestScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();

        UniswapV3PositionInfo poser = new UniswapV3PositionInfo(0x1238536071E1c677A632429e3655c799b22cDA52);
        (uint256 amount0, uint256 amount1, address token0, address token1) = poser.getPositionAmounts(7212, 0xcC4E38D67d8658422Ac2D89Cc63108a7001FA885);
        console2.log(amount0);
        console2.log(amount1);
        console2.log(token0);
        console2.log(token1);

    }
}
