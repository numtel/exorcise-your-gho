// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/interfaces/IERC4906.sol";
import "openzeppelin-contracts/contracts/interfaces/IERC165.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "gho-core/src/contracts/gho/interfaces/IGhoFacilitator.sol";
import {IGhoToken} from 'gho-core/src/contracts/gho/interfaces/IGhoToken.sol';

import "./IPositionValue.sol";
import "./IUniswapV3PositionInfo.sol";

contract UniswapV3PositionFacilitator is Ownable, ERC721Enumerable, IERC721Receiver, IERC4906, IGhoFacilitator {
  error INVALID_POSITION_MANAGER();
  error ONLY_POSITION_OWNER();
  error MINT_OVERFLOW();
  error REPAY_UNDERFLOW();
  error BELOW_LIQUIDATION_THRESHOLD();

  event TokenWrapped(uint256 indexed tokenId, address indexed originator);
  event TokenUnwrapped(uint256 indexed tokenId, address indexed recipient);
  event GhoMinted(uint256 indexed tokenId, uint256 amount);
  event GhoRepaid(uint256 indexed tokenId, uint256 amount);

  uint256 public constant MAX_LTV = 900; // Don't allow minting more than 90% ltv
  uint256 public constant LIQUIDATE = 950; // Allow liquidations at 95% ltv
  uint256 public constant BASIS = 1000;
  uint256 public constant GHO_DECIMALS = 1e18;

  IGhoToken public immutable GHO_TOKEN;
  address private _ghoTreasury;
  IPositionValue public valuer;
  IUniswapV3PositionInfo public positionInfo;

  mapping(uint256 => uint256) public ghoMintedByTokenId;

  constructor(
    address ghoToken,
    address ghoTreasury,
    address _valuer,
    address _positionInfo,
    string memory name,
    string memory symbol
  ) ERC721(name, symbol) Ownable(msg.sender) {
    GHO_TOKEN = IGhoToken(ghoToken);
    _updateGhoTreasury(ghoTreasury);
    valuer = IPositionValue(_valuer);
    positionInfo = IUniswapV3PositionInfo(_positionInfo);
  }

  function positionValue(uint256 tokenId) public view returns(uint256) {
    (uint256 amount0, uint256 amount1, address token0, address token1) = positionInfo.getPositionAmounts(tokenId);
    (uint256 usd, uint8 decimals) = valuer.toUSD(amount0, amount1, token0, token1);

    return usd / (10 ** uint(decimals));
  }

  // TODO restrict to positions in specified pools
  function wrapAndMintGho(uint256 tokenId, uint256 mintAmount) external {
    IERC721(positionInfo.positionManager()).safeTransferFrom(msg.sender, address(this), tokenId);
    _mint(msg.sender, tokenId);
    _mintGho(tokenId, mintAmount);
    emit TokenWrapped(tokenId, msg.sender);
  }

  function mintGho(uint256 tokenId, uint256 mintAmount) external {
    if(ownerOf(tokenId) != msg.sender)
      revert ONLY_POSITION_OWNER();
    _mintGho(tokenId, mintAmount);
  }

  function _mintGho(uint256 tokenId, uint256 mintAmount) internal {
    ghoMintedByTokenId[tokenId] += mintAmount;
    uint256 maxLTV = (positionValue(tokenId) * MAX_LTV) / BASIS;
    if((ghoMintedByTokenId[tokenId] / GHO_DECIMALS) > maxLTV)
      revert MINT_OVERFLOW();
    GHO_TOKEN.mint(msg.sender, mintAmount);
    emit GhoMinted(tokenId, mintAmount);
  }

  function repayGho(uint256 tokenId, uint256 repayAmount) public {
    if(repayAmount > ghoMintedByTokenId[tokenId])
      revert REPAY_UNDERFLOW();
    GHO_TOKEN.transferFrom(msg.sender, address(this), repayAmount);
    GHO_TOKEN.burn(repayAmount);
    emit GhoRepaid(tokenId, repayAmount);
  }

  function repayGhoAndUnwrap(uint256 tokenId) external {
    if(ownerOf(tokenId) != msg.sender)
      revert ONLY_POSITION_OWNER();
    repayGho(tokenId, ghoMintedByTokenId[tokenId]);
    IERC721(positionInfo.positionManager()).safeTransferFrom(address(this), msg.sender, tokenId);
    emit TokenUnwrapped(tokenId, msg.sender);
  }

  function liquidate(uint256 tokenId) external {
    uint256 minLiquidate = (positionValue(tokenId) * LIQUIDATE) / BASIS;
    if((ghoMintedByTokenId[tokenId] / GHO_DECIMALS) < minLiquidate)
      revert BELOW_LIQUIDATION_THRESHOLD();
    repayGho(tokenId, ghoMintedByTokenId[tokenId]);
    IERC721(positionInfo.positionManager()).safeTransferFrom(address(this), msg.sender, tokenId);
    emit TokenUnwrapped(tokenId, msg.sender);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, IERC165) returns (bool) {
    return interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
  }

  function onERC721Received(
      address,
      address,
      uint256,
      bytes calldata
  ) external pure returns (bytes4) {
      return IERC721Receiver.onERC721Received.selector;
  }

  // TODO implement a fee
  function distributeFeesToTreasury() external override {
    uint256 balance = GHO_TOKEN.balanceOf(address(this));
    GHO_TOKEN.transfer(_ghoTreasury, balance);
    emit FeesDistributedToTreasury(_ghoTreasury, address(GHO_TOKEN), balance);
  }

  function getGhoTreasury() external view override returns (address) {
    return _ghoTreasury;
  }

  function updateGhoTreasury(address newGhoTreasury) external override onlyOwner {
    _updateGhoTreasury(newGhoTreasury);
  }

  function _updateGhoTreasury(address newGhoTreasury) internal {
    address oldGhoTreasury = _ghoTreasury;
    _ghoTreasury = newGhoTreasury;
    emit GhoTreasuryUpdated(oldGhoTreasury, newGhoTreasury);
  }
}
