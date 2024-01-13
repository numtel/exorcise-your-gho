// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function mint(address account, uint256 value) external {
    _mint(account, value);
  }

  function burn(uint256 value) external {
    _burn(msg.sender, value);
  }

  function decimals() public view virtual override returns (uint8) {
    return 18;
  }
}

