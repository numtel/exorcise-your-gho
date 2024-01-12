// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";
import "../contracts/PositionValue.sol";

// forge script script/PositionValue.s.sol:TestScript --rpc-url https://rpc.ankr.com/eth -vvvv
contract TestScript is Script {
    function setUp() public {}

    function run() public {
        vm.broadcast();

        // Data from UniswapV3PositionInfo.s.sol for position #643983
        // (Can't comingle those 0.7.6 version solidity files with these)
        uint amount0 = 14064386;
        uint amount1 = 1187647761237064815;
        address token0 = 0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599; //btc
        address token1 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; //eth

        address[] memory knownTokens = new address[](2);
        knownTokens[0] = token0;
        knownTokens[1] = token1;
        address[] memory feeds = new address[](2);
        feeds[0] = 0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c;
        feeds[1] = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
        PositionValue valuer = new PositionValue(knownTokens, feeds);

        (uint usd, uint8 decimals) = valuer.toUSD(amount0, amount1, token0, token1);

        console2.log(usd);
        console2.log(uint(decimals));
        console2.log(usd / (10 ** uint(decimals)));
    }
}
