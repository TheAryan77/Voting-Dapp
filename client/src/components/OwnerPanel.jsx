import React, { useState } from 'react';

export function OwnerPanel({ isOwner, actions, votingActive }) {
  const [newVoter, setNewVoter] = useState('');
  const [proposalName, setProposalName] = useState('');
  const [expanded, setExpanded] = useState(true);

  if (!isOwner) return null;
  return (
    <div className="card fade-in" style={{gridColumn:'1 / -1'}}>
      <div className="space-between" style={{marginBottom:'.35rem'}}>
        <h3 style={{margin:0, fontSize:'1rem', letterSpacing:'.5px'}}>Owner Controls</h3>
        <button className="secondary" style={{padding:'0.4rem .75rem', fontSize:'.7rem'}} onClick={()=>setExpanded(e=>!e)}>{expanded ? 'Hide' : 'Show'}</button>
      </div>
      {expanded && (
        <>
          <form className="inline" onSubmit={async e=>{e.preventDefault(); if(!newVoter) return; await actions.registerVoter(newVoter); setNewVoter('');}}>
            <input placeholder="0x... voter address" value={newVoter} onChange={e=>setNewVoter(e.target.value)} />
            <button type="submit">Register</button>
          </form>
          <form className="inline" onSubmit={async e=>{e.preventDefault(); if(!proposalName.trim()) return; await actions.createProposal(proposalName.trim()); setProposalName('');}}>
            <input placeholder="Proposal title" value={proposalName} onChange={e=>setProposalName(e.target.value)} />
            <button type="submit">Add</button>
          </form>
          <div className="space-between" style={{marginTop:'.5rem'}}>
            <div>Voting: {votingActive ? <span className="badge status-active">Active</span> : <span className="badge">Paused</span>}</div>
            {votingActive ? (
              <button className="secondary" onClick={()=>actions.setVotingStatus(false)}>Stop</button>
            ) : (
              <button onClick={()=>actions.setVotingStatus(true)}>Start</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
