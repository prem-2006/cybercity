// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Interface for Flare Time Series Oracle (FTSO)
interface IFtsoRegistry {
    function getCurrentPrice(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp);
    function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals);
}

// Mock interface for FTSO for hackathon if live one is unavailable
interface IFtsoRegistryMock {
     function getCurrentPrice(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp);
}

contract ChainLens is AccessControl {
    
    // Roles
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    // FTSO Registry
    IFtsoRegistry public ftsoRegistry;

    // Product Data
    enum ProductStatus { Created, InTransit, InStorage, Retail, Sold }

    struct Checkpoint {
        address handler;
        string location; // e.g., "London, UK" or GPS coords
        uint256 timestamp;
        uint256 temperature; // From FTSO or IoT oracle
        uint256 weatherCondition; // Placeholder for FTSO weather data
        bool isVerified;
    }

    struct Product {
        string productId; // Unique string ID (e.g., UUID)
        string metaHash; // IPFS hash of product details
        uint256 batchId;
        ProductStatus status;
        address currentHolder;
        Checkpoint[] history;
    }

    mapping(string => Product) public products;
    mapping(uint256 => string[]) public batchToProducts;

    event ProductRegistered(string productId, uint256 batchId, address manufacturer);
    event CheckpointAdded(string productId, address handler, string location, ProductStatus status);

    constructor(address _ftsoRegistry) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        ftsoRegistry = IFtsoRegistry(_ftsoRegistry);
    }

    // --- Manufacturer Actions ---

    function registerProduct(string memory _productId, string memory _metaHash, uint256 _batchId) external onlyRole(MANUFACTURER_ROLE) {
        require(bytes(products[_productId].productId).length == 0, "Product already exists");

        Product storage p = products[_productId];
        p.productId = _productId;
        p.metaHash = _metaHash;
        p.batchId = _batchId;
        p.status = ProductStatus.Created;
        p.currentHolder = msg.sender;

        // Initial check point
        _addCheckpoint(_productId, "Factory", 2000, 0); // 20.00 C default

        batchToProducts[_batchId].push(_productId);

        emit ProductRegistered(_productId, _batchId, msg.sender);
    }

    // --- Supply Chain Actions ---

    // Generalized checkpoint update. 
    function updateCheckpoint(
        string memory _productId, 
        string memory _location, 
        ProductStatus _newStatus
    ) external {
        // Access check: Must be the current holder or have specific role logic
        // For simplicity: Any Dist/Retailer can accept if they are the next step
        // In real app: We would verify handshakes. Here we check roles.
        
        require(hasRole(DISTRIBUTOR_ROLE, msg.sender) || hasRole(RETAILER_ROLE, msg.sender), "Not authorized");
        
        Product storage p = products[_productId];
        require(bytes(p.productId).length > 0, "Product not found");
        
        // Update holder
        p.currentHolder = msg.sender;
        p.status = _newStatus;

        // Fetch Environment Data from FTSO (Simulated via Price for "Temp" or dedicated feed)
        // For Hackathon demo: we use "FLR" price as a seed for "Random" temp/weather
        // or if we had a "TEMP" oracle, we'd use that.
        // We will try to fetch FLR price to prove FTSO integration.
        uint256 currentTemp = 0;
        try ftsoRegistry.getCurrentPrice("FLR") returns (uint256 price, uint256 ) {
            // Mocking temp from price: e.g. price 0.0300 -> 30 degrees (just for determinism)
            currentTemp = (price / 1e3) % 40; 
        } catch {
            currentTemp = 999; // Error val
        }

        _addCheckpoint(_productId, _location, currentTemp, 0);
        emit CheckpointAdded(_productId, msg.sender, _location, _newStatus);
    }

    function _addCheckpoint(string memory _productId, string memory _location, uint256 _temp, uint256 _weather) internal {
        products[_productId].history.push(Checkpoint({
            handler: msg.sender,
            location: _location,
            timestamp: block.timestamp,
            temperature: _temp,
            weatherCondition: _weather,
            isVerified: true
        }));
    }

    // --- View Functions ---

    function getProductHistory(string memory _productId) external view returns (Checkpoint[] memory) {
        return products[_productId].history;
    }
    
    function getProduct(string memory _productId) external view returns (
        string memory metaHash,
        uint256 batchId,
        ProductStatus status,
        address currentHolder
    ) {
        Product storage p = products[_productId];
        return (p.metaHash, p.batchId, p.status, p.currentHolder);
    }
}
