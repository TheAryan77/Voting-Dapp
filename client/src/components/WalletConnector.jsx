import React from 'react';

export function WalletConnector({ address, connect, network }) {
  const short = (addr) => addr ? addr.slice(0,6) + '...' + addr.slice(-4) : '';
  return (
    <div className="card fade-in" style={{gap:'0.65rem', minHeight:'155px'}}>
      <div className="space-between" style={{alignItems:'flex-start'}}>
        <div style={{display:'flex', flexDirection:'column', gap:'.4rem'}}>
          <strong style={{fontSize:'0.9rem'}}>Wallet</strong>
          {address && <code title={address}>{short(address)}</code>}
        </div>
        {network && <span className="badge" title={network.chainId}>Chain {network.name || network.chainId}</span>}
      </div>
      {!address && (
        <button onClick={connect} aria-label="Connect Wallet">Connect Wallet</button>
      )}
      {address && (
        <div className="small" style={{marginTop:'auto', opacity:.7}}>Connected</div>
      )}
    </div>
  );
}
