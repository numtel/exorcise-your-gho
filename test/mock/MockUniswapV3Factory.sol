// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

contract MockUniswapV3Factory {
    address _pool;

    constructor(address pool) {
      _pool = pool;
    }

    function getPool(
        address,
        address,
        uint24
    ) external view returns (address pool) {
      pool = _pool;
    }
}
