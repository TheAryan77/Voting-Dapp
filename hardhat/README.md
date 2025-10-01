# Voting DApp - Hardhat Project

A decentralized voting application built with Solidity smart contracts and Hardhat framework.

## Features

- **Voter Registration**: Only registered voters can participate
- **Proposal Creation**: Contract owner can create voting proposals
- **Secure Voting**: Each registered voter can vote only once
- **Vote Tracking**: Real-time vote counting for each proposal
- **Winner Detection**: Automatic determination of winning proposal
- **Event Logging**: All actions are logged via blockchain events

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Compile Contracts**:
   ```bash
   npx hardhat compile
   ```

3. **Run Tests**:
   ```bash
   npx hardhat test
   ```

4. **Start Local Blockchain**:
   ```bash
   npx hardhat node
   ```

5. **Deploy to Local Network** (in another terminal):
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

## Project Structure

```
├── contracts/
│   └── VotingContract.sol    # Main voting smart contract
├── scripts/
│   └── deploy.js             # Deployment script
├── test/
│   └── VotingContract.test.js # Comprehensive test suite
├── hardhat.config.js         # Hardhat configuration
└── package.json              # Project dependencies
```

## Smart Contract Functions

### Owner Functions
- `registerVoter(address)` - Register a new voter
- `createProposal(string)` - Create a new proposal
- `setVotingStatus(bool)` - Start/stop voting

### Voter Functions
- `vote(uint256)` - Cast a vote for a proposal

### View Functions
- `getProposal(uint256)` - Get proposal details
- `getVoterInfo(address)` - Get voter information
- `getWinningProposal()` - Get the current winning proposal

## Usage Example

```javascript
// Deploy the contract
const VotingContract = await ethers.getContractFactory("VotingContract");
const voting = await VotingContract.deploy();

// Register voters
await voting.registerVoter("0x...");

// Create proposals
await voting.createProposal("Increase education funding");
await voting.createProposal("Build new parks");

// Start voting
await voting.setVotingStatus(true);

// Voters can now vote
await voting.connect(voter).vote(0); // Vote for proposal 0
```

## Testing

Run the comprehensive test suite:

```bash
npx hardhat test
```

The tests cover:
- Contract deployment
- Voter registration
- Proposal creation
- Voting mechanics
- Access controls
- Edge cases and error conditions

## Network Configuration

The project is configured for:
- **Hardhat Network**: For development and testing
- **Localhost**: For local deployment (`http://127.0.0.1:8545`)
- **Testnet/Mainnet**: Configuration ready (update with your keys)

## Security Features

- **Access Control**: Only owner can register voters and create proposals
- **One Vote Per Voter**: Prevents double voting
- **Input Validation**: Validates all inputs and state changes
- **Event Logging**: All important actions emit events for transparency

## Development Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Deploy to network
npx hardhat run scripts/deploy.js --network <network-name>

# Clean artifacts
npx hardhat clean
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details