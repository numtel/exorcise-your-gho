# Exorcise Your GHO

![Exorcising one's GHO concept art](docs/exorcise.jpg)

Free your GHO when you provide liquidity to support the token! This project is a facilitator to mint GHO against Uniswap V3 position NFTs for GHO/USDC and GHO/USDT.

* Mint up to 90% of the value of your GHO liquidity positions
* Loop your positions to collect even more swap fees
* Why not supply liquidity when you can do it so cheaply?

Inspired by Defrost Finance on Avalanche (now defunct, but it was sweet while Avalanche Rush was going on) and the Aave v2 Ethereum AMM market. (also now defunct)

[View project on ETHGlobal Showcase...](https://ethglobal.com/showcase/exorcise-your-gho-0aawf)

## Installation

> Requires Node.js and Foundry installed

```
$ git clone git@github.com:numtel/exorcise-your-gho.git
$ cd exercise-your-gho
$ npm install
# Run the frontend
$ npm run dev
# Run contract tests
$ forge test
```

## Deployed Contracts

Name | Address
-----|----------
[`UniswapV3PositionFacilitator`](contracts/UniswapV3PositionFacilitator.sol)|[0xdF5306aE2b300Cd21197aE1Ac2A17912fF6C94a7](https://sepolia.etherscan.io/address/0xdF5306aE2b300Cd21197aE1Ac2A17912fF6C94a7)
[`PositionValue`](contracts/PositionValue.sol)|[0x1504a17595d4041722cae6db1437de8941e14a16](https://sepolia.etherscan.io/address/0x1504a17595d4041722cae6db1437de8941e14a16)
[`UniswapV3PositionInfo`](contracts/UniswapV3PositionInfo.sol)|[0xab61cBa43778C01Cc60128C857A7e081EF6F6b65](https://sepolia.etherscan.io/address/0xab61cBa43778C01Cc60128C857A7e081EF6F6b65)

## License

MIT
