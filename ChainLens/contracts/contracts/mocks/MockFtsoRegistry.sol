// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockFtsoRegistry {
    uint256 private mockPrice;
    uint256 private mockTimestamp;

    constructor(uint256 _mockPrice) {
        mockPrice = _mockPrice;
        mockTimestamp = block.timestamp;
    }

    function setDescription(string memory _symbol, uint256 _price) external {
        // Just a helper to change price during tests
        mockPrice = _price;
    }

    function getCurrentPrice(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp) {
        return (mockPrice, block.timestamp);
    }

    function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals) {
        return (mockPrice, block.timestamp, 5);
    }
}
