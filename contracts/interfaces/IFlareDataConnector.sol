// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFlareDataConnector {
    function verifyProof(bytes32 _interactionId, bytes calldata _proof) external view returns (bool);
    function getEventData(bytes calldata _proof) external view returns (bytes32, uint256);
}
