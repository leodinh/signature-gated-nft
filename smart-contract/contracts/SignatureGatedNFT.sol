// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SignatureGatedNFT
 * @dev ERC721 token that can only be minted with valid signatures
 */
contract SignatureGatedNFT is
    ERC721,
    ERC721URIStorage,
    Ownable,
    EIP712,
    ReentrancyGuard
{
    using ECDSA for bytes32;

    // ============ CUSTOM ERRORS ============
    error InvalidRecipientAddress();
    error NonceAlreadyUsed();
    error MaxSupplyReached();
    error InvalidSignature();
    error InvalidSignerAddress();
    error InvalidPremintId();
    error PremintNotActive();
    error InsufficientPayment();
    error PriceMustBeNonNegative();
    error NoBalanceToWithdraw();
    error WithdrawalFailed();

    // ============ CONSTANTS ============
    bytes32 public constant MINT_TYPEHASH =
        keccak256(
            "Mint(address to,uint256 tokenId,string tokenURI,uint256 nonce)"
        );

    // ============ STATE VARIABLES ============

    // Token Management
    uint256 private _tokenIdCounter;
    uint256 public immutable maxSupply;

    // Signature Management
    address public signerAddress;
    mapping(uint256 => bool) public usedNonces;

    // Premint Management
    uint256 public premintCount;
    mapping(uint256 => PremintNFT) public premintNFTs;

    // ============ STRUCTS ============
    struct PremintNFT {
        bool active; // 1 byte - packed for gas efficiency
        uint256 price; // 32 bytes
        string tokenURI; // 32 bytes (pointer)
    }

    // ============ EVENTS ============
    event NFTMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );
    event SignerAddressUpdated(address indexed signer);
    event PremintCreated(
        uint256 indexed premintId,
        string tokenURI,
        uint256 price
    );
    event PremintMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint256 indexed premintId
    );
    event PremintUpdated(
        uint256 indexed premintId,
        string tokenURI,
        uint256 price
    );
    event PremintDeactivated(uint256 indexed premintId);

    // ============ CONSTRUCTOR ============
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_
    ) ERC721(name_, symbol_) EIP712(name_, "1.0.0") Ownable(msg.sender) {
        maxSupply = maxSupply_;
        _tokenIdCounter = 1;
    }

    // ============ PREMINT FUNCTIONS ============

    /**
     * @dev Create a new premint NFT
     * @param _tokenURI Token URI for metadata
     * @param _price Price to mint this NFT
     */
    function createPremint(
        string memory _tokenURI,
        uint256 _price
    ) external onlyOwner {
        if (_price < 0) revert PriceMustBeNonNegative();

        premintCount++;
        uint256 premintId = premintCount;

        premintNFTs[premintId] = PremintNFT({
            active: true,
            price: _price,
            tokenURI: _tokenURI
        });

        emit PremintCreated(premintId, _tokenURI, _price);
    }

    /**
     * @dev Update a premint NFT
     * @param _premintId ID of the premint NFT to update
     * @param _tokenURI New token URI
     * @param _price New price
     */
    function updatePremint(
        uint256 _premintId,
        string memory _tokenURI,
        uint256 _price
    ) external onlyOwner {
        if (_premintId <= 0 || _premintId > premintCount)
            revert InvalidPremintId();
        if (_price < 0) revert PriceMustBeNonNegative();

        PremintNFT storage premint = premintNFTs[_premintId];
        if (!premint.active) revert PremintNotActive();

        premint.tokenURI = _tokenURI;
        premint.price = _price;

        emit PremintUpdated(_premintId, _tokenURI, _price);
    }

    // ============ MINTING FUNCTIONS ============

    /**
     * @dev Mint a new NFT with signature verification
     * @param _to Address to mint the NFT to
     * @param _premintId ID of the premint NFT to mint
     * @param _nonce Unique nonce to prevent replay attacks
     * @param _signature Signature from authorized signer
     */
    function mintWithSignature(
        address _to,
        uint256 _premintId,
        uint256 _nonce,
        bytes memory _signature
    ) external payable nonReentrant {
        if (_premintId <= 0 || _premintId > premintCount)
            revert InvalidPremintId();
        PremintNFT storage premint = premintNFTs[_premintId];
        if (!premint.active) revert PremintNotActive();
        if (msg.value < premint.price) revert InsufficientPayment();

        if (_to == address(0)) revert InvalidRecipientAddress();
        if (usedNonces[_nonce]) revert NonceAlreadyUsed();
        if (_tokenIdCounter > maxSupply) revert MaxSupplyReached();

        if (!_verifySignature(_to, _nonce, premint.tokenURI, _signature))
            revert InvalidSignature();

        // Mark nonce as used
        usedNonces[_nonce] = true;

        // Mint the NFT
        _safeMint(_to, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, premint.tokenURI);
        premint.active = false;

        emit NFTMinted(_to, _tokenIdCounter, premint.tokenURI);
        emit PremintMinted(_to, _tokenIdCounter, _premintId);
        emit PremintDeactivated(_premintId);

        _tokenIdCounter++;
    }

    /**
     * @dev Mint NFT by owner (for testing or special cases)
     * @param _to Address to mint the NFT to
     * @param _tokenURI URI for the token metadata
     */
    function mintByOwner(
        address _to,
        string memory _tokenURI
    ) external onlyOwner {
        if (_to == address(0)) revert InvalidRecipientAddress();
        if (_tokenIdCounter > maxSupply) revert MaxSupplyReached();

        _safeMint(_to, _tokenIdCounter);
        _setTokenURI(_tokenIdCounter, _tokenURI);

        emit NFTMinted(_to, _tokenIdCounter, _tokenURI);

        _tokenIdCounter++;
    }

    // ============ SIGNER MANAGEMENT ============

    /**
     * @dev Update the authorized signer address
     * @param _signer Address of the signer to authorize
     */
    function updateSignerAddress(address _signer) external onlyOwner {
        if (_signer == address(0)) revert InvalidSignerAddress();
        signerAddress = _signer;
        emit SignerAddressUpdated(_signer);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Get premint NFT details
     * @param _premintId ID of the premint NFT
     */
    function getPremintNFT(
        uint256 _premintId
    )
        external
        view
        returns (string memory _tokenURI, uint256 _price, bool _active)
    {
        if (_premintId <= 0 || _premintId > premintCount)
            revert InvalidPremintId();
        PremintNFT storage premint = premintNFTs[_premintId];
        return (premint.tokenURI, premint.price, premint.active);
    }

    /**
     * @dev Get the current token ID
     */
    function getCurrentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Get the total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NoBalanceToWithdraw();

        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert WithdrawalFailed();
    }

    // ============ INTERNAL FUNCTIONS ============

    /**
     * @dev Verify signature for minting
     */
    function _verifySignature(
        address _to,
        uint256 _nonce,
        string memory _tokenURI,
        bytes memory _signature
    ) internal view returns (bool) {
        bytes32 structHash = keccak256(
            abi.encode(
                MINT_TYPEHASH,
                _to,
                _tokenIdCounter,
                keccak256(bytes(_tokenURI)),
                _nonce
            )
        );
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(_signature);
        return signer == signerAddress;
    }

    // ============ OVERRIDE FUNCTIONS ============

    function tokenURI(
        uint256 _tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(_tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // ============ RECEIVE FUNCTION ============

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
