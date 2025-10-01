import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

export function ProposalsList({ proposals, voterInfo, votingActive, onVote }) {
  if (!proposals.length) {
    return <div className="card fade-in" style={{gridColumn:'1 / -1'}}><em>No proposals yet.</em></div>;
  }

  return (
    <div className="grid proposals-grid" style={{gridColumn:'1 / -1'}}>
      {proposals.map(p => {
        const canVote = votingActive && voterInfo.isRegistered && !voterInfo.hasVoted;
        const isUsersVote = voterInfo.hasVoted && voterInfo.votedProposal === p.id;
        return (
          <div className={`card proposal-card fade-in ${isUsersVote ? 'vote-highlight' : ''}`} key={p.id}>
            <div className="space-between" style={{alignItems:'flex-start'}}> 
              <div style={{display:'flex', flexDirection:'column', gap:'.45rem'}}> 
                <div style={{display:'flex', gap:'.5rem', alignItems:'center'}}>
                  <strong style={{fontSize:'0.85rem', letterSpacing:'.5px'}}>PROPOSAL #{p.id}</strong>
                  {isUsersVote && <span className="badge status-active" title="You voted for this">YOURS</span>}
                </div>
                <div style={{fontSize:'0.9rem', lineHeight:1.4}}>{p.name}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <span className="badge" style={{fontSize:'.65rem'}}>Votes</span>
                <div style={{fontSize:'1.15rem', fontWeight:600, marginTop:'.15rem'}}>
                  <AnimatedNumber value={p.voteCount} />
                </div>
              </div>
            </div>
            {canVote && (
              <button style={{marginTop:'.4rem'}} onClick={()=>onVote(p.id)} aria-label={`Vote for proposal ${p.id}`}>Vote</button>
            )}
          </div>
        );
      })}
    </div>
  );
}
