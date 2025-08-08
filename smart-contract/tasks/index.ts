import { task } from "hardhat/config";
import { ethers } from "hardhat";

task("contract-info", "Get information about the deployed contract")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs, hre) => {
    const contract = await ethers.getContractAt("SignatureGatedNFT", taskArgs.address);
    
    console.log("Contract Information:");
    console.log("=====================");
    console.log(`Name: ${await contract.name()}`);
    console.log(`Symbol: ${await contract.symbol()}`);
    console.log(`Max Supply: ${await contract.maxSupply()}`);
    console.log(`Current Token ID: ${await contract.getCurrentTokenId()}`);
    console.log(`Total Supply: ${await contract.totalSupply()}`);
    console.log(`Owner: ${await contract.owner()}`);
  });

task("mint-test", "Mint a test NFT (owner only)")
  .addParam("address", "Contract address")
  .addParam("to", "Recipient address")
  .addParam("uri", "Token URI")
  .setAction(async (taskArgs, hre) => {
    const contract = await ethers.getContractAt("SignatureGatedNFT", taskArgs.address);
    const [deployer] = await ethers.getSigners();
    
    console.log(`Minting NFT to ${taskArgs.to} with URI: ${taskArgs.uri}`);
    const tx = await contract.mintByOwner(taskArgs.to, taskArgs.uri);
    await tx.wait();
    
    console.log("NFT minted successfully!");
  }); 