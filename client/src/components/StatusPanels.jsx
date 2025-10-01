import React from 'react';

export function VoterStatus({ voterInfo }) {
  return (
    <div className="card fade-in" style={{minHeight:'155px'}}>
      <strong style={{fontSize:'0.9rem'}}>Voter Status</strong>
      <div className="small">Registered: {voterInfo.isRegistered ? 'Yes' : 'No'}</div>
      <div className="small">Has Voted: {voterInfo.hasVoted ? 'Yes' : 'No'}</div>
      {voterInfo.hasVoted && (
        <div className="small">Voted: #{voterInfo.votedProposal}</div>
      )}
      {!voterInfo.isRegistered && (
        <div className="small" style={{marginTop:'auto', color:'var(--warn)'}}>Awaiting registration…</div>
      )}
    </div>
  );
}

export function ResultsPanel({ winning, proposals }) {
  if (!winning || !proposals.length) return (
    <div className="card fade-in" style={{minHeight:'155px'}}>
      <strong style={{fontSize:'0.9rem'}}>Results</strong>
      <div className="small">No winner yet.</div>
    </div>
  );
  return (
    <div className="card fade-in" style={{minHeight:'155px'}}>
      <strong style={{fontSize:'0.9rem'}}>Current Leader</strong>
      <div style={{fontSize:'0.85rem', lineHeight:1.4, fontWeight:600}}>{winning.winningName}</div>
      <div className="small">ID #{winning.winningId} • {winning.winningVoteCount} votes</div>
    </div>
  );
}
