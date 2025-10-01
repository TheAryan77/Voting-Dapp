const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VotingContract...");

  // Get the contract factory
  const VotingContract = await ethers.getContractFactory("VotingContract");

  // Deploy the contract
  const votingContract = await VotingContract.deploy();

  // Wait for deployment to complete
  await votingContract.waitForDeployment();

  const contractAddress = await votingContract.getAddress();
  console.log("VotingContract deployed to:", contractAddress);

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deployed by account:", deployer.address);
  
  // Optional: Create some sample proposals
  console.log("\nCreating sample proposals...");
  
  await votingContract.createProposal("Proposal A: Increase funding for education");
  console.log("Created Proposal 0: Increase funding for education");
  
  await votingContract.createProposal("Proposal B: Implement renewable energy initiatives");
  console.log("Created Proposal 1: Implement renewable energy initiatives");
  
  await votingContract.createProposal("Proposal C: Improve public transportation");
  console.log("Created Proposal 2: Improve public transportation");
  
  console.log("\nContract deployment complete!");
  console.log("Contract Address:", contractAddress);
  console.log("You can now interact with the contract using this address.");
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });