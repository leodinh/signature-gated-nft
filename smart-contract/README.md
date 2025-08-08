# Signature Gated NFT Smart Contract

A secure, gas-optimized ERC721 NFT contract that implements signature-gated minting functionality with premint support. Only users with valid signatures from authorized signers can mint NFTs.

## 🚀 Features

- **Signature-gated minting**: NFTs can only be minted with valid signatures from authorized signers
- **Premint system**: Create and manage premint NFTs that can be minted by users
- **EIP-712 compliant**: Uses EIP-712 for structured data signing
- **Nonce protection**: Prevents replay attacks with unique nonces
- **Owner controls**: Contract owner can mint directly and manage signers
- **Supply limit**: Configurable maximum supply
- **Gas optimized**: Includes Solidity optimizer settings and custom errors
- **Organized structure**: Clean, well-organized contract with clear sections
- **Comprehensive testing**: Full test coverage for all functionality

## 📋 Contract Overview

### `SignatureGatedNFT`

The main contract that inherits from:
- `ERC721`: Standard NFT functionality
- `ERC721URIStorage`: URI storage for token metadata
- `Ownable`: Access control for owner functions
- `EIP712`: EIP-712 structured data signing
- `ReentrancyGuard`: Protection against reentrancy attacks

### 🏗️ Contract Structure

The contract is organized into clear sections:

```solidity
// ============ CUSTOM ERRORS ============
// Gas-efficient custom errors instead of require statements

// ============ CONSTANTS ============
// EIP-712 typehash for signature verification

// ============ STATE VARIABLES ============
// Token Management
// Signature Management  
// Premint Management

// ============ STRUCTS ============
// PremintNFT struct for premint data

// ============ EVENTS ============
// All contract events

// ============ CONSTRUCTOR ============
// Contract initialization

// ============ PREMINT FUNCTIONS ============
// createPremint, updatePremint

// ============ MINTING FUNCTIONS ============
// mintWithSignature, mintByOwner

// ============ SIGNER MANAGEMENT ============
// updateSignerAddress

// ============ VIEW FUNCTIONS ============
// getPremintNFT, getCurrentTokenId, totalSupply, getBalance

// ============ ADMIN FUNCTIONS ============
// withdraw

// ============ INTERNAL FUNCTIONS ============
// _verifySignature

// ============ OVERRIDE FUNCTIONS ============
// tokenURI, supportsInterface

// ============ RECEIVE FUNCTION ============
// receive() for ETH transfers
```

## 🎯 Key Functions

### Premint Functions
- `createPremint(string tokenURI, uint256 price)`: Create a new premint NFT (owner only)
- `updatePremint(uint256 premintId, string tokenURI, uint256 price)`: Update a premint NFT (owner only)
- `getPremintNFT(uint256 premintId)`: Get premint NFT details
- `getAllPremintNFTs()`: Get all active premint NFTs

### Minting Functions
- `mintWithSignature(address to, uint256 premintId, uint256 nonce, bytes signature)`: Mint with signature verification
- `mintByOwner(address to, string tokenURI)`: Direct minting by owner

### Signer Management
- `updateSignerAddress(address signer)`: Update the authorized signer address (owner only)

### View Functions
- `getCurrentTokenId()`: Get the next token ID to be minted
- `totalSupply()`: Get total number of minted tokens
- `maxSupply()`: Get maximum supply limit
- `getBalance()`: Get contract balance

### Admin Functions
- `withdraw()`: Withdraw contract balance (owner only)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Configure your `.env` file with:
- Network URLs (Sepolia, Mainnet)
- Private key for deployment
- Etherscan API key for verification

## 🚀 Usage

### Compilation
```bash
npm run compile
```

### Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test
npx hardhat test --grep "Should mint premint NFT correctly"
```

### Local Development
```bash
# Start local hardhat node
npm run node

# Deploy to local network
npm run deploy:local
```

### Deployment

#### Enhanced Deploy Script
The deploy script now includes:
- Initial premint creation
- Signer setup
- Contract verification
- Detailed deployment information

```bash
# Deploy with enhanced script
npx hardhat run scripts/deploy.ts
```

#### Sepolia Testnet
```bash
npm run deploy:sepolia
```

#### Mainnet
```bash
npm run deploy:mainnet
```

### Contract Verification

#### Sepolia
```bash
npm run verify:sepolia <CONTRACT_ADDRESS> "CyberCats" "CC" 100
```

#### Mainnet
```bash
npm run verify:mainnet <CONTRACT_ADDRESS> "CyberCats" "CC" 100
```

## 🎨 Premint System

The contract includes a sophisticated premint system:

### Creating Premints
```solidity
// Owner creates a premint
await nft.createPremint("ipfs://QmTokenURI", ethers.parseEther("0.1"));
```

### Minting Premints
```solidity
// User mints a premint with signature
const signature = await createSignature(user.address, 1, tokenURI, nonce);
await nft.mintWithSignature(user.address, 1, nonce, signature, { value: price });
```

### Premint Lifecycle
1. **Created**: Owner creates premint with tokenURI and price
2. **Active**: Premint is available for minting
3. **Minted**: User mints the premint (becomes inactive)
4. **Inactive**: Premint can no longer be minted

## 🔐 Signature Generation

To mint an NFT, you need a valid signature from an authorized signer. Here's how to generate the signature:

### JavaScript/TypeScript Example

```typescript
import { ethers } from 'ethers';

const domain = {
  name: 'CyberCats',
  version: '1.0.0',
  chainId: 1, // Mainnet
  verifyingContract: '0x...', // Contract address
};

const types = {
  Mint: [
    { name: 'to', type: 'address' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'tokenURI', type: 'string' },
    { name: 'nonce', type: 'uint256' },
  ],
};

const value = {
  to: '0x...', // Recipient address
  tokenId: 1, // Token ID
  tokenURI: 'ipfs://Qm...', // Token URI
  nonce: 1, // Unique nonce
};

const signature = await signer.signTypedData(domain, types, value);
```

### Frontend Integration

```typescript
// Example of minting with signature
const mintWithSignature = async (
  to: string,
  premintId: number,
  nonce: number,
  signature: string,
  value: BigNumber
) => {
  const tx = await nftContract.mintWithSignature(to, premintId, nonce, signature, { value });
  await tx.wait();
  console.log('NFT minted successfully!');
};
```

## 🔒 Security Features

1. **Signature Verification**: All minting requires valid EIP-712 signatures
2. **Nonce Protection**: Each signature can only be used once
3. **Authorized Signers**: Only pre-authorized addresses can sign valid mint requests
4. **Owner Controls**: Contract owner has additional minting capabilities
5. **Supply Limits**: Maximum supply prevents unlimited minting
6. **Reentrancy Protection**: Guards against reentrancy attacks
7. **Custom Errors**: Gas-efficient error handling
8. **Premint Deactivation**: Premints are automatically deactivated after minting

## 🧪 Testing

The contract includes comprehensive tests covering:

### Test Categories
- **Deployment**: Contract initialization and configuration
- **Signer Management**: Signer authorization and updates
- **Premint Management**: Creating, updating, and managing premints
- **Minting**: Direct minting and signature-based minting
- **View Functions**: All getter functions
- **Admin Functions**: Withdrawal and owner functions
- **Edge Cases**: Error conditions and boundary cases

### Running Tests
```bash
# Run all tests
npm test

# Run specific test category
npx hardhat test --grep "Premint Management"

# Run with gas reporting
REPORT_GAS=true npm test
```

## 📊 Gas Optimization

The contract includes several gas optimizations:

1. **Custom Errors**: Replaced require statements with custom errors
2. **Struct Packing**: Optimized struct layout for gas efficiency
3. **Unchecked Math**: Used unchecked for safe arithmetic operations
4. **Storage Caching**: Cached storage reads in loops
5. **Immutable Variables**: Used immutable for constants

## 🚀 Deployment Scripts

### Enhanced Deploy Script
The new deploy script includes:
- Configuration display
- Initial premint creation
- Contract verification
- Detailed deployment information
- Error handling

### Verification Script
A verification script to check contract state:
```bash
# Set contract address and run verification
CONTRACT_ADDRESS=0x... npx hardhat run scripts/verify.ts
```

## 📁 Project Structure

```
smart-contract/
├── contracts/
│   └── SignatureGatedNFT.sol    # Main contract
├── scripts/
│   ├── deploy.ts                # Enhanced deployment script
│   └── verify.ts                # Contract verification script
├── test/
│   └── SignatureGatedNFT.test.ts # Comprehensive tests
├── hardhat.config.ts            # Hardhat configuration
└── README.md                    # This file
```

## 🔄 Version History

### v2.0.0 (Current)
- ✅ Added premint system
- ✅ Organized contract structure
- ✅ Custom errors for gas efficiency
- ✅ Enhanced deployment scripts
- ✅ Comprehensive test coverage
- ✅ Gas optimizations
- ✅ Better error handling

### v1.0.0
- ✅ Basic signature-gated minting
- ✅ EIP-712 compliance
- ✅ Owner controls

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 🆘 Support

For questions or support, please open an issue on GitHub.

## 🔗 Links

- [EIP-712](https://eips.ethereum.org/EIPS/eip-712)
- [ERC-721](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- [Hardhat](https://hardhat.org/)
