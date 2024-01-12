// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/interfaces/IERC4906.sol";
import "openzeppelin-contracts/contracts/interfaces/IERC165.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "gho-core/src/contracts/gho/interfaces/IGhoFacilitator.sol";
import {IGhoToken} from 'gho-core/src/contracts/gho/interfaces/IGhoToken.sol';
import "./IPositionValue.sol";
import "./IUniswapV3PositionInfo.sol";

contract UniswapV3PositionFacilitator is Ownable, ERC721Enumerable, IERC4906, IGhoFacilitator {
  IGhoToken public immutable GHO_TOKEN;
  address private _ghoTreasury;
  IPositionValue public valuer;
  IUniswapV3PositionInfo public positionInfo;

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

  function positionValue(uint256 positionId, address pool) public view returns(uint256) {
    (uint256 amount0, uint256 amount1, address token0, address token1) = positionInfo.getPositionAmounts(positionId, pool);
    (uint256 usd, uint8 decimals) = valuer.toUSD(amount0, amount1, token0, token1);

    return usd / (10 ** uint(decimals));
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, IERC165) returns (bool) {
    return interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
  }

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
