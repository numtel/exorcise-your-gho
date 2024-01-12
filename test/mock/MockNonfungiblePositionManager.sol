// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import "../../contracts/INonfungiblePositionManager.sol";

// From ChatGPT4
contract MockNonfungiblePositionManager is INonfungiblePositionManager {
    Position private position;

    function setPosition(Position memory _position) public {
        position = _position;
    }

    function positions(uint256) external view override returns (Position memory) {
        return position;
    }
}
