# Voting DApp Client

React + Vite frontend for the `VotingContract` Hardhat project.

## Features
- Connect wallet (MetaMask / injected provider)
- Display proposals and live vote counts (event-driven updates)
- Owner controls: register voters, create proposals, start/stop voting
- Voter status panel (registered, voted, selection)
- Current winning proposal display
- Manual refresh + automatic event listeners
- Debug panel for quickly inspecting state
- Multi-theme UI (Dark, Light, Vibrant, Sunset, Violet, Ocean) with persistence

## Prerequisites
- Node.js 18+
- Deployed `VotingContract` address (Hardhat local, testnet, etc.)

## Setup
```bash
cd client
cp .env.example .env
# edit .env and set VITE_CONTRACT_ADDRESS=0x... (optional, you can also paste it in the UI)

npm install
npm run dev
```
Open http://localhost:5173

## Usage Flow
1. Deploy contract (from `hardhat` folder):
   ```bash
   npx hardhat run scripts/deploy.js --network <yourNetwork>
   ```
2. Copy the deployed address into `.env` or the Contract Address input field in UI.
3. Connect your wallet.
4. As owner: register voter addresses & create proposals.
5. Start voting.
6. Voters cast a single vote each.
7. Stop voting when done and check winning proposal panel.

## Changing Contract Address at Runtime
- Paste a new address in the header input and press "Refresh".

## Notes
- The contract requires the wallet account to be registered before voting.
- In case of ties the first proposal with highest votes is returned by `getWinningProposal`.
- Errors from reverted transactions will appear in the red alert bar.

## Build / Production
```bash
npm run build
npm run preview
```
The static build output is in `dist/`.

## Tech Stack
- React 18
- Vite
- Ethers v6

## Themes
You can switch themes using the theme toggle component in the header. Themes available:

| Key | Description |
|-----|-------------|
| dark | Default elevated cool dark palette |
| light | Neutral light surface variant |
| vibrant | High contrast cyan/teal accent dark mode |
| sunset | Warm orange / rose dusk aesthetic |
| violet | Purple accented deep space look |
| ocean | Aqua / emerald maritime dark theme |

Persistence: The last selected theme is saved in `localStorage` under `ui-theme`.


## Future Improvements
- Persist last used contract address in localStorage
- Pagination / long proposal lists virtualization
- ENS reverse lookup for addresses
- WalletConnect integration
- Light/dark theme toggle

---
Happy voting! 🗳️
