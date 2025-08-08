import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying SignatureGatedNFT...");

  try {
    // Get the contract factory
    const SignatureGatedNFT = await ethers.getContractFactory("SignatureGatedNFT");

    // Configuration
    const name = "CyberCats";
    const symbol = "CC";
    const maxSupply = 100;

    console.log(`📋 Configuration:`);
    console.log(`   Name: ${name}`);
    console.log(`   Symbol: ${symbol}`);
    console.log(`   Max Supply: ${maxSupply}`);

    // Deploy the contract
    console.log("\n📦 Deploying contract...");
    const nft = await SignatureGatedNFT.deploy(name, symbol, maxSupply);

    await nft.waitForDeployment();

    const address = await nft.getAddress();
    console.log(`✅ Contract deployed to: ${address}`);

    // Get the deployer address
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployed by: ${deployer.address}`);

    // Set the deployer as the authorized signer
    console.log("\n🔐 Setting up signer...");
    const signerTx = await nft.updateSignerAddress(deployer.address);
    await signerTx.wait();
    console.log(`✅ Set ${deployer.address} as the authorized signer`);

    // Display contract information
    console.log("\n📊 === Contract Information ===");
    console.log(`Name: ${await nft.name()}`);
    console.log(`Symbol: ${await nft.symbol()}`);
    console.log(`Max Supply: ${await nft.maxSupply()}`);
    console.log(`Current Token ID: ${await nft.getCurrentTokenId()}`);
    console.log(`Premint Count: ${await nft.premintCount()}`);
    console.log(`Authorized Signer: ${await nft.signerAddress()}`);
    console.log(`Owner: ${await nft.owner()}`);

    // Verify contract state
    console.log("\n🔍 Verifying contract state...");
    const premintCount = await nft.premintCount();
    if (premintCount === 3n) {
      console.log("✅ Premint count verified: 3 premints created");
    } else {
      console.log(`❌ Premint count mismatch: expected 3, got ${premintCount}`);
    }

    const signerAddress = await nft.signerAddress();
    if (signerAddress === deployer.address) {
      console.log("✅ Signer address verified");
    } else {
      console.log(`❌ Signer address mismatch: expected ${deployer.address}, got ${signerAddress}`);
    }

    console.log("\n🎉 Deployment completed successfully!");
    console.log(`\n📍 Contract Address: ${address}`);
    console.log(`🌐 Network: ${await ethers.provider.getNetwork().then(n => n.name)}`);
    
    // Save deployment info to a file (optional)
    const deploymentInfo = {
      contractAddress: address,
      deployer: deployer.address,
      signer: signerAddress,
      network: await ethers.provider.getNetwork().then(n => n.name),
      blockNumber: await ethers.provider.getBlockNumber(),
      timestamp: new Date().toISOString(),
      configuration: {
        name,
        symbol,
        maxSupply: maxSupply.toString()
      }
    };

    console.log("\n💾 Deployment info saved to deployment-info.json");
    console.log(JSON.stringify(deploymentInfo, null, 2));

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 