const { ethers } = require("hardhat");

async function main() {
  // This script demonstrates how to interact with the deployed VotingContract
  
  console.log("=== Voting Contract Interaction Demo ===\n");
  
  // Get signers
  const [owner, voter1, voter2, voter3] = await ethers.getSigners();
  
  console.log("Accounts:");
  console.log("Owner:", owner.address);
  console.log("Voter 1:", voter1.address);
  console.log("Voter 2:", voter2.address);
  console.log("Voter 3:", voter3.address);
  console.log();
  
  // Deploy contract (in real scenario, you'd connect to an existing deployment)
  const VotingContract = await ethers.getContractFactory("VotingContract");
  const voting = await VotingContract.deploy();
  await voting.waitForDeployment();
  
  const contractAddress = await voting.getAddress();
  console.log("Contract deployed at:", contractAddress);
  console.log();
  
  // 1. Register voters
  console.log("=== Registering Voters ===");
  await voting.registerVoter(voter1.address);
  console.log("✓ Registered voter1:", voter1.address);
  
  await voting.registerVoter(voter2.address);
  console.log("✓ Registered voter2:", voter2.address);
  
  await voting.registerVoter(voter3.address);
  console.log("✓ Registered voter3:", voter3.address);
  console.log();
  
  // 2. Create proposals
  console.log("=== Creating Proposals ===");
  await voting.createProposal("Increase funding for renewable energy projects");
  console.log("✓ Created Proposal 0: Increase funding for renewable energy projects");
  
  await voting.createProposal("Implement universal basic income program");
  console.log("✓ Created Proposal 1: Implement universal basic income program");
  
  await voting.createProposal("Build new public transportation infrastructure");
  console.log("✓ Created Proposal 2: Build new public transportation infrastructure");
  console.log();
  
  // 3. Start voting
  console.log("=== Starting Voting ===");
  await voting.setVotingStatus(true);
  console.log("✓ Voting is now active");
  console.log();
  
  // 4. Cast votes
  console.log("=== Casting Votes ===");
  
  // Voter 1 votes for proposal 0
  await voting.connect(voter1).vote(0);
  console.log("✓ Voter1 voted for Proposal 0");
  
  // Voter 2 votes for proposal 1
  await voting.connect(voter2).vote(1);
  console.log("✓ Voter2 voted for Proposal 1");
  
  // Voter 3 votes for proposal 0
  await voting.connect(voter3).vote(0);
  console.log("✓ Voter3 voted for Proposal 0");
  console.log();
  
  // 5. Check results
  console.log("=== Current Results ===");
  
  const proposalCount = await voting.proposalCount();
  console.log(`Total Proposals: ${proposalCount}\n`);
  
  for (let i = 0; i < proposalCount; i++) {
    const [name, voteCount] = await voting.getProposal(i);
    console.log(`Proposal ${i}: ${name}`);
    console.log(`  Votes: ${voteCount}`);
    console.log();
  }
  
  // 6. Get winning proposal
  console.log("=== Winner ===");
  const [winningId, winningName, winningVotes] = await voting.getWinningProposal();
  console.log(`🏆 Winning Proposal: ${winningName}`);
  console.log(`   ID: ${winningId}`);
  console.log(`   Total Votes: ${winningVotes}`);
  console.log();
  
  // 7. Check voter information
  console.log("=== Voter Information ===");
  for (const voter of [voter1, voter2, voter3]) {
    const [isRegistered, hasVoted, votedProposal] = await voting.getVoterInfo(voter.address);
    console.log(`${voter.address}:`);
    console.log(`  Registered: ${isRegistered}`);
    console.log(`  Has Voted: ${hasVoted}`);
    if (hasVoted) {
      console.log(`  Voted for Proposal: ${votedProposal}`);
    }
    console.log();
  }
  
  // 8. Stop voting
  console.log("=== Ending Voting ===");
  await voting.setVotingStatus(false);
  console.log("✓ Voting has been stopped");
  console.log();
  
  console.log("=== Demo Complete ===");
  console.log("Contract Address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });