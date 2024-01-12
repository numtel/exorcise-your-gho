// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";
import "../contracts/PositionValue.sol";

// forge script script/PositionValue.s.sol:TestScript --rpc-url https://rpc.ankr.com/eth_sepolia -vvvv
contract TestScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();

        // Data from UniswapV3PositionInfo.s.sol for position #7212
        // (Can't comingle those 0.7.6 version solidity files with these)
        uint amount0 = 1999999999;
        uint amount1 = 3093681823864942341700;
        address token0 = 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8; //usdc
        address token1 = 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60; //gho

        address[] memory knownTokens = new address[](2);
        knownTokens[0] = token0;
        knownTokens[1] = token1;
        address[] memory feeds = new address[](2);
        feeds[0] = 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;
        feeds[1] = 0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E;
        PositionValue valuer = new PositionValue(knownTokens, feeds);

        (uint usd, uint8 decimals) = valuer.toUSD(amount0, amount1, token0, token1);

        console2.log(usd);
        console2.log(uint(decimals));
        console2.log(usd / (10 ** uint(decimals)));
    }
}
