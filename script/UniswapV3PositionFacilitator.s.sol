// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console2} from "forge-std/Script.sol";
import "../test/contracts/DummyERC20.sol";
import "../contracts/PositionValue.sol";
import "../contracts/UniswapV3PositionFacilitator.sol";

// POSITION_INFO=0xab61cBa43778C01Cc60128C857A7e081EF6F6b65 forge script script/UniswapV3PositionFacilitator.s.sol:Deploy --rpc-url https://rpc.ankr.com/eth_sepolia --broadcast --verify -vvvv
contract Deploy is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address token0 = 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8; //usdc
        address token1 = 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60; //gho

        address[] memory knownTokens = new address[](2);
        knownTokens[0] = token0;
        knownTokens[1] = token1;
        address[] memory feeds = new address[](2);
        feeds[0] = 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;
        feeds[1] = 0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E;
        PositionValue valuer = new PositionValue(knownTokens, feeds);


        DummyERC20 fakeGho = new DummyERC20('Fake GHO', 'fGHO');

        new UniswapV3PositionFacilitator(
          address(fakeGho),
          address(1),
          address(valuer),
          vm.envAddress('POSITION_INFO'),
          "GHO/USDC LP leveraged",
          "GHO/USDC LP leveraged"
        );

        vm.stopBroadcast();
    }
}

contract Test is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UniswapV3PositionFacilitator facilitator = UniswapV3PositionFacilitator(0x47830b5Ee4a5472210400fB1811C3396fDAAf381);
        facilitator.wrapAndMintGho(7212, 1e18);

        vm.stopBroadcast();
    }
}
