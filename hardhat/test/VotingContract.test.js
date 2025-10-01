const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract", function () {
  let votingContract;
  let owner;
  let voter1;
  let voter2;
  let voter3;

  beforeEach(async function () {
    // Get signers
    [owner, voter1, voter2, voter3] = await ethers.getSigners();

    // Deploy contract
    const VotingContract = await ethers.getContractFactory("VotingContract");
    votingContract = await VotingContract.deploy();
    await votingContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await votingContract.owner()).to.equal(owner.address);
    });

    it("Should initialize with voting inactive", async function () {
      expect(await votingContract.votingActive()).to.equal(false);
    });

    it("Should initialize with zero proposals", async function () {
      expect(await votingContract.proposalCount()).to.equal(0);
    });
  });

  describe("Voter Registration", function () {
    it("Should register a voter", async function () {
      await votingContract.registerVoter(voter1.address);
      const [isRegistered, hasVoted, votedProposal] = await votingContract.getVoterInfo(voter1.address);
      
      expect(isRegistered).to.equal(true);
      expect(hasVoted).to.equal(false);
    });

    it("Should emit VoterRegistered event", async function () {
      await expect(votingContract.registerVoter(voter1.address))
        .to.emit(votingContract, "VoterRegistered")
        .withArgs(voter1.address);
    });

    it("Should not allow non-owner to register voters", async function () {
      await expect(
        votingContract.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should not allow registering the same voter twice", async function () {
      await votingContract.registerVoter(voter1.address);
      await expect(
        votingContract.registerVoter(voter1.address)
      ).to.be.revertedWith("Voter is already registered");
    });
  });

  describe("Proposal Creation", function () {
    it("Should create a proposal", async function () {
      await votingContract.createProposal("Test Proposal");
      
      const [name, voteCount] = await votingContract.getProposal(0);
      expect(name).to.equal("Test Proposal");
      expect(voteCount).to.equal(0);
    });

    it("Should increment proposal count", async function () {
      await votingContract.createProposal("Proposal 1");
      await votingContract.createProposal("Proposal 2");
      
      expect(await votingContract.proposalCount()).to.equal(2);
    });

    it("Should emit ProposalCreated event", async function () {
      await expect(votingContract.createProposal("Test Proposal"))
        .to.emit(votingContract, "ProposalCreated")
        .withArgs(0, "Test Proposal");
    });

    it("Should not allow non-owner to create proposals", async function () {
      await expect(
        votingContract.connect(voter1).createProposal("Test Proposal")
      ).to.be.revertedWith("Only owner can call this function");
    });

    it("Should not allow empty proposal names", async function () {
      await expect(
        votingContract.createProposal("")
      ).to.be.revertedWith("Proposal name cannot be empty");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      // Register voters and create proposals
      await votingContract.registerVoter(voter1.address);
      await votingContract.registerVoter(voter2.address);
      await votingContract.createProposal("Proposal A");
      await votingContract.createProposal("Proposal B");
      await votingContract.setVotingStatus(true);
    });

    it("Should allow registered voter to vote", async function () {
      await votingContract.connect(voter1).vote(0);
      
      const [isRegistered, hasVoted, votedProposal] = await votingContract.getVoterInfo(voter1.address);
      expect(hasVoted).to.equal(true);
      expect(votedProposal).to.equal(0);
      
      const [name, voteCount] = await votingContract.getProposal(0);
      expect(voteCount).to.equal(1);
    });

    it("Should emit VoteCast event", async function () {
      await expect(votingContract.connect(voter1).vote(0))
        .to.emit(votingContract, "VoteCast")
        .withArgs(voter1.address, 0);
    });

    it("Should not allow unregistered voter to vote", async function () {
      await expect(
        votingContract.connect(voter3).vote(0)
      ).to.be.revertedWith("You must be registered to vote");
    });

    it("Should not allow voting twice", async function () {
      await votingContract.connect(voter1).vote(0);
      await expect(
        votingContract.connect(voter1).vote(1)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should not allow voting when voting is inactive", async function () {
      await votingContract.setVotingStatus(false);
      await expect(
        votingContract.connect(voter1).vote(0)
      ).to.be.revertedWith("Voting is not currently active");
    });

    it("Should not allow voting for non-existent proposal", async function () {
      await expect(
        votingContract.connect(voter1).vote(999)
      ).to.be.revertedWith("Proposal does not exist");
    });
  });

  describe("Voting Status Management", function () {
    it("Should allow owner to change voting status", async function () {
      await votingContract.setVotingStatus(true);
      expect(await votingContract.votingActive()).to.equal(true);
      
      await votingContract.setVotingStatus(false);
      expect(await votingContract.votingActive()).to.equal(false);
    });

    it("Should emit VotingStatusChanged event", async function () {
      await expect(votingContract.setVotingStatus(true))
        .to.emit(votingContract, "VotingStatusChanged")
        .withArgs(true);
    });

    it("Should not allow non-owner to change voting status", async function () {
      await expect(
        votingContract.connect(voter1).setVotingStatus(true)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Winning Proposal", function () {
    beforeEach(async function () {
      // Setup voting scenario
      await votingContract.registerVoter(voter1.address);
      await votingContract.registerVoter(voter2.address);
      await votingContract.createProposal("Proposal A");
      await votingContract.createProposal("Proposal B");
      await votingContract.createProposal("Proposal C");
      await votingContract.setVotingStatus(true);
    });

    it("Should return correct winning proposal", async function () {
      // Vote for different proposals
      await votingContract.connect(voter1).vote(1); // Proposal B
      await votingContract.connect(voter2).vote(1); // Proposal B
      
      const [winningId, winningName, winningCount] = await votingContract.getWinningProposal();
      expect(winningId).to.equal(1);
      expect(winningName).to.equal("Proposal B");
      expect(winningCount).to.equal(2);
    });

    it("Should handle tie scenarios", async function () {
      // Create a tie - first proposal wins in case of tie
      await votingContract.connect(voter1).vote(0);
      await votingContract.connect(voter2).vote(1);
      
      const [winningId, winningName, winningCount] = await votingContract.getWinningProposal();
      expect(winningCount).to.equal(1);
      // In case of tie, the first proposal with the highest count wins
    });

    it("Should revert if no proposals exist", async function () {
      // Deploy a new contract without proposals
      const VotingContract = await ethers.getContractFactory("VotingContract");
      const emptyContract = await VotingContract.deploy();
      
      await expect(
        emptyContract.getWinningProposal()
      ).to.be.revertedWith("No proposals exist");
    });
  });
});