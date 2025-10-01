// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract VotingContract {
    struct Proposal {
        string name;
        uint256 voteCount;
        bool exists;
    }
    
    struct Voter {
        bool hasVoted;
        uint256 votedProposal;
        bool isRegistered;
    }
    
    address public owner;
    mapping(address => Voter) public voters;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    bool public votingActive;
    
    event ProposalCreated(uint256 indexed proposalId, string name);
    event VoteCast(address indexed voter, uint256 indexed proposalId);
    event VoterRegistered(address indexed voter);
    event VotingStatusChanged(bool status);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "You must be registered to vote");
        _;
    }
    
    modifier votingIsActive() {
        require(votingActive, "Voting is not currently active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        proposalCount = 0;
        votingActive = false;
    }
    
    /**
     * @dev Register a voter
     * @param voter Address of the voter to register
     */
    function registerVoter(address voter) public onlyOwner {
        require(!voters[voter].isRegistered, "Voter is already registered");
        
        voters[voter].isRegistered = true;
        voters[voter].hasVoted = false;
        
        emit VoterRegistered(voter);
    }
    
    /**
     * @dev Create a new proposal
     * @param name Name of the proposal
     */
    function createProposal(string memory name) public onlyOwner {
        require(bytes(name).length > 0, "Proposal name cannot be empty");
        
        proposals[proposalCount] = Proposal({
            name: name,
            voteCount: 0,
            exists: true
        });
        
        emit ProposalCreated(proposalCount, name);
        proposalCount++;
    }
    
    /**
     * @dev Cast a vote for a proposal
     * @param proposalId ID of the proposal to vote for
     */
    function vote(uint256 proposalId) public onlyRegisteredVoter votingIsActive {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(proposals[proposalId].exists, "Proposal does not exist");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposal = proposalId;
        proposals[proposalId].voteCount++;
        
        emit VoteCast(msg.sender, proposalId);
    }
    
    /**
     * @dev Start or stop voting
     * @param status True to start voting, false to stop
     */
    function setVotingStatus(bool status) public onlyOwner {
        votingActive = status;
        emit VotingStatusChanged(status);
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     * @return name Name of the proposal
     * @return voteCount Number of votes received
     */
    function getProposal(uint256 proposalId) public view returns (string memory name, uint256 voteCount) {
        require(proposals[proposalId].exists, "Proposal does not exist");
        Proposal memory proposal = proposals[proposalId];
        return (proposal.name, proposal.voteCount);
    }
    
    /**
     * @dev Get voter information
     * @param voter Address of the voter
     * @return isRegistered Whether the voter is registered
     * @return hasVoted Whether the voter has voted
     * @return votedProposal ID of the proposal voted for (if voted)
     */
    function getVoterInfo(address voter) public view returns (bool isRegistered, bool hasVoted, uint256 votedProposal) {
        Voter memory voterInfo = voters[voter];
        return (voterInfo.isRegistered, voterInfo.hasVoted, voterInfo.votedProposal);
    }
    
    /**
     * @dev Get the winning proposal
     * @return winningProposalId ID of the winning proposal
     * @return winningProposalName Name of the winning proposal
     * @return winningVoteCount Number of votes for the winning proposal
     */
    function getWinningProposal() public view returns (uint256 winningProposalId, string memory winningProposalName, uint256 winningVoteCount) {
        require(proposalCount > 0, "No proposals exist");
        
        uint256 winningCount = 0;
        uint256 winningId = 0;
        
        for (uint256 i = 0; i < proposalCount; i++) {
            if (proposals[i].voteCount > winningCount) {
                winningCount = proposals[i].voteCount;
                winningId = i;
            }
        }
        
        return (winningId, proposals[winningId].name, winningCount);
    }
}