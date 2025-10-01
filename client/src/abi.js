// VotingContract ABI extracted from Hardhat artifact
export const VOTING_CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"ProposalCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"VoteCast","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"}],"name":"VoterRegistered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"VotingStatusChanged","type":"event"},
  {"inputs":[{"internalType":"string","name":"name","type":"string"}],"name":"createProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"getProposal","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"getVoterInfo","outputs":[{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"bool","name":"hasVoted","type":"bool"},{"internalType":"uint256","name":"votedProposal","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getWinningProposal","outputs":[{"internalType":"uint256","name":"winningProposalId","type":"uint256"},{"internalType":"string","name":"winningProposalName","type":"string"},{"internalType":"uint256","name":"winningVoteCount","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"proposalCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"voteCount","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"voter","type":"address"}],"name":"registerVoter","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bool","name":"status","type":"bool"}],"name":"setVotingStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"proposalId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":[{"internalType":"bool","name":"hasVoted","type":"bool"},{"internalType":"uint256","name":"votedProposal","type":"uint256"},{"internalType":"bool","name":"isRegistered","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"votingActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}
];
