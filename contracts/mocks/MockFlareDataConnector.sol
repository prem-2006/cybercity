// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IFlareDataConnector.sol";

contract MockFlareDataConnector is IFlareDataConnector {
    bool public shouldVerify;
    bytes32 public mockedEventId;

    constructor() {
        shouldVerify = true;
    }

    function setVerificationResult(bool _result) external {
        shouldVerify = _result;
    }

    function setMockedEventId(bytes32 _id) external {
        mockedEventId = _id;
    }

    function verifyProof(bytes32 _interactionId, bytes calldata _proof) external view override returns (bool) {
        return shouldVerify;
    }

    function getEventData(bytes calldata _proof) external view override returns (bytes32, uint256) {
        return (mockedEventId, 0);
    }
}
