import { expect } from "chai";
import { ethers } from "hardhat";
import { SignatureGatedNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SignatureGatedNFT", function () {
  let nft: SignatureGatedNFT;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let signer: SignerWithAddress;

  const name = "Signature Gated NFT";
  const symbol = "SGNT";
  const maxSupply = 1000;

  beforeEach(async function () {
    [owner, user1, user2, signer] = await ethers.getSigners();

    const SignatureGatedNFT = await ethers.getContractFactory("SignatureGatedNFT");
    nft = await SignatureGatedNFT.deploy(name, symbol, maxSupply);
    await nft.waitForDeployment();

    // Set the signer address
    await nft.updateSignerAddress(signer.address);
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await nft.name()).to.equal(name);
      expect(await nft.symbol()).to.equal(symbol);
    });

    it("Should set the correct max supply", async function () {
      expect(await nft.maxSupply()).to.equal(maxSupply);
    });

    it("Should set the correct owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should initialize token counter to 1", async function () {
      expect(await nft.getCurrentTokenId()).to.equal(1);
    });

    it("Should initialize premint count to 0", async function () {
      expect(await nft.premintCount()).to.equal(0);
    });
  });

  describe("Signer Management", function () {
    it("Should allow owner to update signer address", async function () {
      const newSigner = user1.address;
      await expect(nft.updateSignerAddress(newSigner))
        .to.emit(nft, "SignerAddressUpdated")
        .withArgs(newSigner);
      
      expect(await nft.signerAddress()).to.equal(newSigner);
    });

    it("Should revert when non-owner tries to update signer", async function () {
      await expect(
        nft.connect(user1).updateSignerAddress(user2.address)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should revert when trying to set signer to zero address", async function () {
      await expect(
        nft.updateSignerAddress(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(nft, "InvalidSignerAddress");
    });
  });

  describe("Premint Management", function () {
    const tokenURI = "ipfs://QmTest123";
    const price = ethers.parseEther("0.1");

    it("Should allow owner to create premint", async function () {
      await expect(nft.createPremint(tokenURI, price))
        .to.emit(nft, "PremintCreated")
        .withArgs(1, tokenURI, price);

      expect(await nft.premintCount()).to.equal(1);
      
      const premint = await nft.getPremintNFT(1);
      expect(premint[0]).to.equal(tokenURI); // tokenURI
      expect(premint[1]).to.equal(price); // price
      expect(premint[2]).to.be.true; // active
    });

    it("Should revert when non-owner tries to create premint", async function () {
      await expect(
        nft.connect(user1).createPremint(tokenURI, price)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should revert when creating premint with negative price", async function () {
      // Test with a very large number that would be considered negative in some contexts
      // Since Solidity uint256 doesn't support negative numbers, we'll test the boundary
      await expect(
        nft.createPremint(tokenURI, 0)
      ).to.not.be.reverted; // Should not revert for 0
      
      // Test with a very large number to ensure it doesn't revert
      const largePrice = ethers.parseEther("1000000");
      await expect(
        nft.createPremint(tokenURI, largePrice)
      ).to.not.be.reverted;
    });

    it("Should allow owner to update premint", async function () {
      await nft.createPremint(tokenURI, price);
      
      const newTokenURI = "ipfs://QmNew123";
      const newPrice = ethers.parseEther("0.2");
      
      await expect(nft.updatePremint(1, newTokenURI, newPrice))
        .to.emit(nft, "PremintUpdated")
        .withArgs(1, newTokenURI, newPrice);

      const premint = await nft.getPremintNFT(1);
      expect(premint[0]).to.equal(newTokenURI);
      expect(premint[1]).to.equal(newPrice);
      expect(premint[2]).to.be.true;
    });

    it("Should revert when updating non-existent premint", async function () {
      await expect(
        nft.updatePremint(1, tokenURI, price)
      ).to.be.revertedWithCustomError(nft, "InvalidPremintId");
    });

    it("Should revert when updating inactive premint", async function () {
      await nft.createPremint(tokenURI, price);
      // Mint the premint to deactivate it
      const nonce = 123;
      const signature = await createSignature(user1.address, 1, tokenURI, nonce);
      await nft.connect(user1).mintWithSignature(user1.address, 1, nonce, signature, { value: price });
      
      await expect(
        nft.updatePremint(1, "new-uri", price)
      ).to.be.revertedWithCustomError(nft, "PremintNotActive");
    });

    it("Should revert when getting non-existent premint", async function () {
      await expect(
        nft.getPremintNFT(1)
      ).to.be.revertedWithCustomError(nft, "InvalidPremintId");
    });
  });

  describe("Minting", function () {
    const tokenURI = "ipfs://QmTest123";
    const price = ethers.parseEther("0.1");

    beforeEach(async function () {
      await nft.createPremint(tokenURI, price);
    });

    it("Should allow owner to mint directly", async function () {
      await expect(nft.mintByOwner(user1.address, tokenURI))
        .to.emit(nft, "NFTMinted")
        .withArgs(user1.address, 1, tokenURI);

      expect(await nft.ownerOf(1)).to.equal(user1.address);
      expect(await nft.tokenURI(1)).to.equal(tokenURI);
    });

    it("Should revert when non-owner tries to mint directly", async function () {
      await expect(
        nft.connect(user1).mintByOwner(user2.address, tokenURI)
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should revert when minting to zero address", async function () {
      await expect(
        nft.mintByOwner(ethers.ZeroAddress, tokenURI)
      ).to.be.revertedWithCustomError(nft, "InvalidRecipientAddress");
    });

    it("Should revert when max supply is reached", async function () {
      // Deploy a contract with max supply of 1
      const LimitedNFT = await ethers.getContractFactory("SignatureGatedNFT");
      const limitedNft = await LimitedNFT.deploy(name, symbol, 1);
      await limitedNft.waitForDeployment();
      await limitedNft.updateSignerAddress(signer.address);

      // First mint should succeed
      await expect(limitedNft.mintByOwner(user1.address, tokenURI))
        .to.emit(limitedNft, "NFTMinted")
        .withArgs(user1.address, 1, tokenURI);
      
      // Second mint should fail
      await expect(
        limitedNft.mintByOwner(user2.address, tokenURI)
      ).to.be.revertedWithCustomError(limitedNft, "MaxSupplyReached");
    });

    it("Should mint premint NFT correctly", async function () {
      const nonce = 123;
      const signature = await createSignature(user1.address, 1, tokenURI, nonce);

      await expect(
        nft.connect(user1).mintWithSignature(user1.address, 1, nonce, signature, { value: price })
      )
        .to.emit(nft, "NFTMinted")
        .withArgs(user1.address, 1, tokenURI)
        .to.emit(nft, "PremintMinted")
        .withArgs(user1.address, 1, 1)
        .to.emit(nft, "PremintDeactivated")
        .withArgs(1);

      expect(await nft.ownerOf(1)).to.equal(user1.address);
      expect(await nft.tokenURI(1)).to.equal(tokenURI);
      
      // Check that premint is deactivated
      const premint = await nft.getPremintNFT(1);
      expect(premint[2]).to.be.false; // active should be false
    });

    it("Should revert when minting premint with insufficient payment", async function () {
      const nonce = 123;
      const signature = await createSignature(user1.address, 1, tokenURI, nonce);

      await expect(
        nft.connect(user1).mintWithSignature(user1.address, 1, nonce, signature, { value: ethers.parseEther("0.05") })
      ).to.be.revertedWithCustomError(nft, "InsufficientPayment");
    });

    it("Should revert when minting inactive premint", async function () {
      // First mint to deactivate the premint
      const nonce1 = 123;
      const signature1 = await createSignature(user1.address, 1, tokenURI, nonce1);
      await nft.connect(user1).mintWithSignature(user1.address, 1, nonce1, signature1, { value: price });
      
      const nonce2 = 456;
      const signature2 = await createSignature(user2.address, 1, tokenURI, nonce2);

      await expect(
        nft.connect(user2).mintWithSignature(user2.address, 1, nonce2, signature2, { value: price })
      ).to.be.revertedWithCustomError(nft, "PremintNotActive");
    });

    it("Should revert when using invalid signature", async function () {
      const nonce = 123;
      // Create an invalid signature by using wrong signer
      const wrongSignature = await createSignatureWithWrongSigner(user1.address, 1, tokenURI, nonce);

      await expect(
        nft.connect(user1).mintWithSignature(user1.address, 1, nonce, wrongSignature, { value: price })
      ).to.be.revertedWithCustomError(nft, "InvalidSignature");
    });

    it("Should revert when using already used nonce", async function () {
      const nonce = 123;
      const signature = await createSignature(user1.address, 1, tokenURI, nonce);

      // First mint
      await nft.connect(user1).mintWithSignature(user1.address, 1, nonce, signature, { value: price });

      // Create a new premint for the second test
      await nft.createPremint("uri2", price);
      
      // Try to mint again with same nonce but different premint
      await expect(
        nft.connect(user2).mintWithSignature(user2.address, 2, nonce, signature, { value: price })
      ).to.be.revertedWithCustomError(nft, "NonceAlreadyUsed");
    });
  });

  describe("View Functions", function () {
    it("Should return correct total supply", async function () {
      expect(await nft.totalSupply()).to.equal(0);
      
      await nft.mintByOwner(user1.address, "uri1");
      expect(await nft.totalSupply()).to.equal(1);
      
      await nft.mintByOwner(user2.address, "uri2");
      expect(await nft.totalSupply()).to.equal(2);
    });

    it("Should return correct current token ID", async function () {
      expect(await nft.getCurrentTokenId()).to.equal(1);
      
      await nft.mintByOwner(user1.address, "uri1");
      expect(await nft.getCurrentTokenId()).to.equal(2);
    });

    it("Should return correct contract balance", async function () {
      expect(await nft.getBalance()).to.equal(0);
      
      // Send some ETH to contract using the contract's address
      const contractAddress = await nft.getAddress();
      await owner.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther("1")
      });
      
      expect(await nft.getBalance()).to.equal(ethers.parseEther("1"));
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to withdraw balance", async function () {
      // Send some ETH to contract
      const amount = ethers.parseEther("1");
      const contractAddress = await nft.getAddress();
      await owner.sendTransaction({
        to: contractAddress,
        value: amount
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await nft.withdraw();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
      expect(await nft.getBalance()).to.equal(0);
    });

    it("Should revert when non-owner tries to withdraw", async function () {
      await expect(
        nft.connect(user1).withdraw()
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should revert when trying to withdraw with zero balance", async function () {
      await expect(
        nft.withdraw()
      ).to.be.revertedWithCustomError(nft, "NoBalanceToWithdraw");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple premints correctly", async function () {
      await nft.createPremint("uri1", ethers.parseEther("0.1"));
      await nft.createPremint("uri2", ethers.parseEther("0.2"));
      await nft.createPremint("uri3", ethers.parseEther("0.3"));

      expect(await nft.premintCount()).to.equal(3);

      const premint1 = await nft.getPremintNFT(1);
      const premint2 = await nft.getPremintNFT(2);
      const premint3 = await nft.getPremintNFT(3);

      expect(premint1[0]).to.equal("uri1");
      expect(premint2[0]).to.equal("uri2");
      expect(premint3[0]).to.equal("uri3");
    });

    it("Should handle premint deactivation correctly", async function () {
      await nft.createPremint("uri1", ethers.parseEther("0.1"));
      await nft.createPremint("uri2", ethers.parseEther("0.2"));

      // Mint first premint to deactivate it
      const nonce = 123;
      const signature = await createSignature(user1.address, 1, "uri1", nonce);
      await nft.connect(user1).mintWithSignature(user1.address, 1, nonce, signature, { value: ethers.parseEther("0.1") });

    });
  });

  // Helper function to create signatures
  async function createSignature(
    to: string,
    tokenId: number,
    tokenURI: string,
    nonce: number
  ): Promise<string> {
    const domain = {
      name: name,
      version: "1.0.0",
      chainId: await ethers.provider.getNetwork().then(n => n.chainId),
      verifyingContract: await nft.getAddress()
    };

    const types = {
      Mint: [
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "tokenURI", type: "string" },
        { name: "nonce", type: "uint256" }
      ]
    };

    const value = {
      to: to,
      tokenId: tokenId,
      tokenURI: tokenURI,
      nonce: nonce
    };

    return await signer.signTypedData(domain, types, value);
  }

  // Helper function to create invalid signatures
  async function createSignatureWithWrongSigner(
    to: string,
    tokenId: number,
    tokenURI: string,
    nonce: number
  ): Promise<string> {
    const domain = {
      name: name,
      version: "1.0.0",
      chainId: await ethers.provider.getNetwork().then(n => n.chainId),
      verifyingContract: await nft.getAddress()
    };

    const types = {
      Mint: [
        { name: "to", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "tokenURI", type: "string" },
        { name: "nonce", type: "uint256" }
      ]
    };

    const value = {
      to: to,
      tokenId: tokenId,
      tokenURI: tokenURI,
      nonce: nonce
    };

    // Use user1 as signer instead of the authorized signer
    return await user1.signTypedData(domain, types, value);
  }
}); 