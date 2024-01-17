// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// This is mocking a different part of the contract than
//  test/mock/MockNonfungiblePositionManager.sol

import "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/interfaces/IERC4906.sol";
import "openzeppelin-contracts/contracts/interfaces/IERC165.sol";

contract MockPositionManager is ERC721Enumerable, IERC4906 {
  constructor() ERC721("Test", "TEST") {}

  function mint(uint256 tokenId) external {
    _mint(msg.sender, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Enumerable, IERC165) returns (bool) {
    return interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
  }

}
