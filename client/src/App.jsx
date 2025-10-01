import React, { useState } from 'react';
import { useVotingContract } from './hooks/useVotingContract';
import { WalletConnector } from './components/WalletConnector';
import { OwnerPanel } from './components/OwnerPanel';
import { ProposalsList } from './components/ProposalsList';
import { VoterStatus, ResultsPanel } from './components/StatusPanels';
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  const {
    connect, address, network, isOwner, voterInfo, votingActive, proposals, winning, error, txPending, contractAddress, setContractAddress, actions
  } = useVotingContract();

  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="container">
      <header>
        <div style={{display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap'}}>
          <h1>Voting DApp</h1>
          <ThemeToggle />
        </div>
        <div style={{display:'flex', gap:'.6rem', alignItems:'center', flexWrap:'wrap'}}>
          <input className="focus-ring" style={{width:'320px', maxWidth:'100%'}} value={contractAddress} onChange={e=>setContractAddress(e.target.value)} placeholder="Contract Address" />
          <button className="secondary" onClick={actions.refresh} title="Reload contract state">Refresh</button>
        </div>
      </header>

      {error && <div className="alert error fade-in" style={{marginBottom:'1rem'}}>{error}</div>}
      {txPending && (
        <div className="alert info fade-in" style={{marginBottom:'1rem'}}>
          <div className="spinner" aria-hidden />
          <div>Transaction pending...</div>
        </div>
      )}

      <div className="grid" style={{gap:'1.2rem', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))'}}>
        <WalletConnector address={address} connect={connect} network={network} />
        <VoterStatus voterInfo={voterInfo} />
        <ResultsPanel winning={winning} proposals={proposals} />
      </div>

      <hr />

      <OwnerPanel isOwner={isOwner} actions={actions} votingActive={votingActive} />

      <ProposalsList proposals={proposals} voterInfo={voterInfo} votingActive={votingActive} onVote={actions.vote} isOwner={isOwner} />

      <div style={{marginTop:'1.5rem'}}>
        <button className="secondary" onClick={()=>setShowAdvanced(s=>!s)}>{showAdvanced ? 'Hide Debug' : 'Show Debug'}</button>
        {showAdvanced && (
          <div className="card fade-in" style={{marginTop:'.75rem'}}>
            <strong>Debug Info</strong>
            <pre style={{whiteSpace:'pre-wrap', fontSize:'0.7rem', margin:0}}>{JSON.stringify({ address, isOwner, voterInfo, votingActive, winning }, null, 2)}</pre>
          </div>
        )}
      </div>

      <footer>Built with React + Ethers v6. Paste your deployed contract address above to interact.</footer>
    </div>
  );
}
