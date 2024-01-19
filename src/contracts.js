import UniswapV3PositionFacilitatorABI from './abi/UniswapV3PositionFacilitator.json';
import NonfungiblePositionManagerABI from './abi/NonfungiblePositionManager.json';

export const defaultChain = 11155111;

export const byChain = {
  11155111: {
    chain: 11155111,
    name: 'Sepolia',
    explorer: 'https://sepolia.etherscan.io/',
    poolManager: 'https://app.uniswap.org/pools/XXX?chain=sepolia',
    addLiquidity: 'https://app.uniswap.org/add/',
    ghoToken: '0x4488A882FD9f26B992d4c37113964fDB0eFc13a4',
    ghoTokenName: 'Fake GHO',
    ghoDecimals: 18n,
    posManName: 'Uniswap V3 Positions NFT-V1',
    nativeCurrency: 'sETH',
    allowedPools: [
      ['0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
       '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
       'GHO/USDC'],
    ],
    UniswapV3PositionFacilitator: {
      address: '0xf7CA3DA647B345B7107E890ABf1036f4e5dDEE29',
      abi: UniswapV3PositionFacilitatorABI,
      chainId: 11155111,
    },
    NonfungiblePositionManager: {
      address: '0x1238536071E1c677A632429e3655c799b22cDA52',
      abi: NonfungiblePositionManagerABI,
      chainId: 11155111,
    },
  },
};

export function chainContracts(chain) {
  if(chain && (chain.id in byChain || chain in byChain)) return byChain[chain.id || chain];
  return byChain[defaultChain];
}
