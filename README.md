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
[`UniswapV3PositionFacilitator`](contracts/UniswapV3PositionFacilitator.sol)|[0xf7CA3DA647B345B7107E890ABf1036f4e5dDEE29](https://sepolia.etherscan.io/address/0xf7CA3DA647B345B7107E890ABf1036f4e5dDEE29)
[`PositionValue`](contracts/PositionValue.sol)|[0x8BD91a7D6C178065e82d673311797A6086Ba7080](https://sepolia.etherscan.io/address/0x8BD91a7D6C178065e82d673311797A6086Ba7080)
[`UniswapV3PositionInfo`](contracts/UniswapV3PositionInfo.sol)|[0xab61cBa43778C01Cc60128C857A7e081EF6F6b65](https://sepolia.etherscan.io/address/0xab61cBa43778C01Cc60128C857A7e081EF6F6b65)

## License

MIT
