// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol";
import "../contracts/UniswapV3PositionFacilitator.sol";

import "./mock/MockUniswapV3PositionInfo.sol";
import "./mock/MockPositionValue.sol";
import "./mock/MockPositionManager.sol";
import "./contracts/DummyERC20.sol";

contract UniswapV3PositionFacilitatorTest is IERC721Receiver, Test {
  error MINTS_PAUSED();
  error LIQUIDATIONS_PAUSED();
  error ONLY_POSITION_OWNER();
  error MINT_OVERFLOW();
  error REPAY_UNDERFLOW();
  error BELOW_LIQUIDATION_THRESHOLD();

  event TokenWrapped(uint256 indexed tokenId, address indexed originator);
  event TokenUnwrapped(uint256 indexed tokenId, address indexed recipient);
  event GhoMinted(uint256 indexed tokenId, uint256 amount);
  event GhoRepaid(uint256 indexed tokenId, uint256 amount);
  event PauseMintsChanged(bool oldValue, bool newValue);
  event PauseLiquidationsChanged(bool oldValue, bool newValue);

  DummyERC20 ghoToken;
  MockPositionManager posMan;
  MockUniswapV3PositionInfo posInfo;
  MockPositionValue valuer;
  UniswapV3PositionFacilitator facilitator;

  uint256 constant amount0 = 1e18;
  uint256 constant amount1 = 1e19;
  address constant token0 = address(2);
  address constant token1 = address(3);
  uint256 constant valueInGho = 10000 * 1e18;

  function setUp() public {
    ghoToken = new DummyERC20('Fake GHO', 'fGHO');
    posMan = new MockPositionManager();
    posInfo = new MockUniswapV3PositionInfo(amount0, amount1, token0, token1, address(posMan));
    valuer = new MockPositionValue(1e6, 2); // $10,000.00
    facilitator = new UniswapV3PositionFacilitator(
      address(ghoToken),
      address(1),
      address(valuer),
      address(posInfo),
      "GHO/USDC LP leveraged",
      "GHO/USDC LP leveraged"
    );
  }

  function testCreatePositionSuccess() public {
    uint tokenId = 111;
    uint maxMint = valueInGho * facilitator.MAX_LTV() / facilitator.BASIS();

    vm.expectEmit();
    emit PauseMintsChanged(false, true);
    facilitator.updateStatus(true, false);

    posMan.mint(tokenId);
    posMan.approve(address(facilitator), tokenId);

    vm.expectRevert(MINTS_PAUSED.selector);
    facilitator.wrapAndMintGho(tokenId, maxMint);

    vm.expectEmit();
    emit PauseMintsChanged(true, false);
    facilitator.updateStatus(false, false);

    vm.expectRevert(MINT_OVERFLOW.selector);
    facilitator.wrapAndMintGho(tokenId, maxMint + 1e18);

    vm.expectEmit();
    emit TokenWrapped(tokenId, address(this));
    emit GhoMinted(tokenId, maxMint);
    facilitator.wrapAndMintGho(tokenId, maxMint);
    assertEq(ghoToken.balanceOf(address(this)), maxMint);

    // Can repay from any address
    ghoToken.transfer(address(1), maxMint);
    vm.prank(address(1));
    ghoToken.approve(address(facilitator), maxMint);

    vm.prank(address(1));
    vm.expectRevert(REPAY_UNDERFLOW.selector);
    facilitator.repayGho(tokenId, maxMint + 1);

    vm.prank(address(1));
    vm.expectEmit();
    emit GhoRepaid(tokenId, maxMint);
    facilitator.repayGho(tokenId, maxMint);

    vm.prank(address(1));
    vm.expectRevert(ONLY_POSITION_OWNER.selector);
    facilitator.mintGho(tokenId, maxMint);

    vm.prank(address(1));
    vm.expectRevert(ONLY_POSITION_OWNER.selector);
    facilitator.repayGhoAndUnwrap(tokenId);

    vm.expectEmit();
    emit TokenUnwrapped(tokenId, address(this));
    facilitator.repayGhoAndUnwrap(tokenId);
  }

  function testLiquidation() public {
    uint tokenId = 123;
    uint maxMint = valueInGho * facilitator.MAX_LTV() / facilitator.BASIS();

    posMan.mint(tokenId);
    posMan.approve(address(facilitator), tokenId);
    facilitator.wrapAndMintGho(tokenId, maxMint);

    vm.expectRevert(BELOW_LIQUIDATION_THRESHOLD.selector);
    facilitator.liquidate(tokenId);

    valuer.setUsd(1e5); // decimated

    ghoToken.transfer(address(1), maxMint);
    vm.prank(address(1));
    ghoToken.approve(address(facilitator), maxMint);

    vm.expectEmit();
    emit PauseLiquidationsChanged(false, true);
    facilitator.updateStatus(false, true);

    vm.prank(address(1));
    vm.expectRevert(LIQUIDATIONS_PAUSED.selector);
    facilitator.liquidate(tokenId);

    facilitator.updateStatus(false, false);

    vm.prank(address(1));
    facilitator.liquidate(tokenId);

    assertEq(posMan.tokenOfOwnerByIndex(address(1), 0), tokenId);
  }

  function onERC721Received(
      address,
      address,
      uint256,
      bytes calldata
  ) external pure returns (bytes4) {
      return IERC721Receiver.onERC721Received.selector;
  }

}

