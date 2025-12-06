// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IFlareDataConnector.sol";

contract DeFAIAgent {
    address public owner;
    address public recipient;
    IFlareDataConnector public fdc;
    bytes32 public conditionId;
    bool public executed;

    event FundsReleased(address indexed recipient, uint256 amount);
    event DepositReceived(address indexed sender, uint256 amount);

    constructor(address _owner, address _recipient, address _fdc, bytes32 _conditionId) {
        owner = _owner;
        recipient = _recipient;
        fdc = IFlareDataConnector(_fdc);
        conditionId = _conditionId;
        executed = false;
    }

    receive() external payable {
        emit DepositReceived(msg.sender, msg.value);
    }

    function execute(bytes calldata _proof) external {
        require(!executed, "Already executed");
        
        (bytes32 proofId, ) = fdc.getEventData(_proof);
        require(proofId == conditionId, "Invalid proof condition");
        
        bool verified = fdc.verifyProof(proofId, _proof);
        require(verified, "Proof verification failed");

        executed = true;
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to release");

        (bool sent, ) = recipient.call{value: balance}("");
        require(sent, "Transfer failed");

        emit FundsReleased(recipient, balance);
    }

    function updateCondition(bytes32 _newConditionId) external {
        require(msg.sender == owner, "Only owner");
        conditionId = _newConditionId;
    }

    function emergencyWithdraw() external {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }
}
