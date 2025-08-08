import { ethers } from "hardhat";

async function main() {
  // Get the contract address from environment variable or use a default
  const contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  console.log(`🔍 Verifying contract at: ${contractAddress}`);

  try {
    // First, check if the contract exists by getting its code
    const code = await ethers.provider.getCode(contractAddress);
    if (code === "0x") {
      console.error("❌ No contract found at the specified address");
      process.exit(1);
    }

    // Get the contract instance
    const nft = await ethers.getContractAt("SignatureGatedNFT", contractAddress);

    // Get contract information
    console.log("\n📊 === Contract Information ===");
    
    try {
      const name = await nft.name();
      console.log(`Name: ${name}`);
    } catch (error) {
      console.log(`Name: ❌ Error retrieving name`);
    }

    try {
      const symbol = await nft.symbol();
      console.log(`Symbol: ${symbol}`);
    } catch (error) {
      console.log(`Symbol: ❌ Error retrieving symbol`);
    }

    try {
      const maxSupply = await nft.maxSupply();
      console.log(`Max Supply: ${maxSupply}`);
    } catch (error) {
      console.log(`Max Supply: ❌ Error retrieving max supply`);
    }

    try {
      const currentTokenId = await nft.getCurrentTokenId();
      console.log(`Current Token ID: ${currentTokenId}`);
    } catch (error) {
      console.log(`Current Token ID: ❌ Error retrieving current token ID`);
    }

    try {
      const totalSupply = await nft.totalSupply();
      console.log(`Total Supply: ${totalSupply}`);
    } catch (error) {
      console.log(`Total Supply: ❌ Error retrieving total supply`);
    }

    try {
      const premintCount = await nft.premintCount();
      console.log(`Premint Count: ${premintCount}`);
    } catch (error) {
      console.log(`Premint Count: ❌ Error retrieving premint count`);
    }

    try {
      const signerAddress = await nft.signerAddress();
      console.log(`Authorized Signer: ${signerAddress}`);
    } catch (error) {
      console.log(`Authorized Signer: ❌ Error retrieving signer address`);
    }

    try {
      const owner = await nft.owner();
      console.log(`Owner: ${owner}`);
    } catch (error) {
      console.log(`Owner: ❌ Error retrieving owner`);
    }

    try {
      const balance = await nft.getBalance();
      console.log(`Contract Balance: ${ethers.formatEther(balance)} ETH`);
    } catch (error) {
      console.log(`Contract Balance: ❌ Error retrieving balance`);
    }

    // Get premint information if available
    try {
      const premintCount = await nft.premintCount();
      if (premintCount > 0) {
        console.log("\n🎨 === Premint Information ===");
        for (let i = 1; i <= premintCount; i++) {
          try {
            const premint = await nft.getPremintNFT(i);
            console.log(`Premint ${i}:`);
            console.log(`  Token URI: ${premint[0]}`);
            console.log(`  Price: ${ethers.formatEther(premint[1])} ETH`);
            console.log(`  Active: ${premint[2] ? "✅ Yes" : "❌ No"}`);
          } catch (error) {
            console.log(`Premint ${i}: ❌ Error retrieving information`);
          }
        }
      }
    } catch (error) {
      console.log("\n🎨 === Premint Information ===");
      console.log("❌ Error retrieving premint information");
    }

    console.log("\n🎉 Verification completed successfully!");

  } catch (error) {
    console.error("❌ Verification failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 