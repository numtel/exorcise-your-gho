// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;
pragma abicoder v2;

import {Script, console2} from "forge-std/Script.sol";
import "../contracts/UniswapV3PositionInfo.sol";

// forge script script/UniswapV3PositionInfo.s.sol:TestScript --rpc-url https://rpc.ankr.com/eth -vvvv
contract TestScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();

        UniswapV3PositionInfo poser = new UniswapV3PositionInfo(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
        (uint256 amount0, uint256 amount1) = poser.getPositionAmounts(37, 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8);
//         (uint256 amount0, uint256 amount1) = poser.getPositionAmounts(643983, 0xCBCdF9626bC03E24f779434178A73a0B4bad62eD);
        console2.log(amount0);
        console2.log(amount1);
    }
}
