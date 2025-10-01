import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { VOTING_CONTRACT_ABI } from '../abi';

/**
 * Hook to interact with VotingContract
 */
export function useVotingContract() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [contractAddress, setContractAddress] = useState(import.meta.env.VITE_CONTRACT_ADDRESS || '');
  const [isOwner, setIsOwner] = useState(false);
  const [owner, setOwner] = useState(null);
  const [voterInfo, setVoterInfo] = useState({ isRegistered: false, hasVoted: false, votedProposal: null });
  const [votingActive, setVotingActive] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [winning, setWinning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txPending, setTxPending] = useState(false);

  const contract = useMemo(() => {
    if (!contractAddress || !provider) return null;
    try {
      return new ethers.Contract(contractAddress, VOTING_CONTRACT_ABI, signer || provider);
    } catch (e) {
      console.error('Failed to init contract', e);
      return null;
    }
  }, [contractAddress, provider, signer]);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('No injected wallet (MetaMask) found');
      return;
    }
    try {
      setError(null);
      const _provider = new ethers.BrowserProvider(window.ethereum);
      await _provider.send('eth_requestAccounts', []);
      const _signer = await _provider.getSigner();
      const addr = await _signer.getAddress();
      const net = await _provider.getNetwork();
      setProvider(_provider);
      setSigner(_signer);
      setAddress(addr);
      setNetwork(net);
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  }, []);

  // Load static/public data
  const refreshCore = useCallback(async () => {
    if (!contract) return;
    try {
      const [_owner, _active, count] = await Promise.all([
        contract.owner(),
        contract.votingActive(),
        contract.proposalCount(),
      ]);
      setOwner(_owner);
      setVotingActive(_active);
      if (address) setIsOwner(_owner.toLowerCase() === address.toLowerCase());
      const list = [];
      for (let i = 0; i < Number(count); i++) {
        try {
          const [name, voteCount] = await contract.getProposal(i);
          list.push({ id: i, name, voteCount: Number(voteCount) });
        } catch (_) {}
      }
      setProposals(list);
      if (Number(count) > 0) {
        try {
          const [winningId, winningName, winningVoteCount] = await contract.getWinningProposal();
          setWinning({ winningId: Number(winningId), winningName, winningVoteCount: Number(winningVoteCount) });
        } catch (err) {
          // ignore (e.g. revert when no proposals)
        }
      } else {
        setWinning(null);
      }
      if (address) {
        try {
          const [isRegistered, hasVoted, votedProposal] = await contract.getVoterInfo(address);
          setVoterInfo({ isRegistered, hasVoted, votedProposal: Number(votedProposal) });
        } catch (_) {}
      }
    } catch (e) {
      console.error(e);
    }
  }, [contract, address]);

  // Write helpers
  const txWrap = useCallback(async (fn) => {
    if (!contract || !signer) throw new Error('Wallet not connected');
    setTxPending(true);
    setError(null);
    try {
      const tx = await fn();
      await tx.wait();
      await refreshCore();
    } catch (e) {
      console.error(e);
      setError(e.reason || e.message);
      throw e;
    } finally {
      setTxPending(false);
    }
  }, [contract, signer, refreshCore]);

  const registerVoter = useCallback(async (addr) => txWrap(() => contract.registerVoter(addr)), [txWrap, contract]);
  const createProposal = useCallback(async (name) => txWrap(() => contract.createProposal(name)), [txWrap, contract]);
  const setVotingStatus = useCallback(async (status) => txWrap(() => contract.setVotingStatus(status)), [txWrap, contract]);
  const vote = useCallback(async (proposalId) => txWrap(() => contract.vote(proposalId)), [txWrap, contract]);

  // Events subscription
  useEffect(() => {
    if (!contract) return;
    const handlers = [];

    const onProposal = (id, name) => {
      setProposals((p) => {
        const exists = p.find(x => x.id === Number(id));
        if (exists) return p;
        return [...p, { id: Number(id), name, voteCount: 0 }];
      });
    };
    contract.on('ProposalCreated', onProposal); handlers.push(['ProposalCreated', onProposal]);

    const onVoteCast = (voter, proposalId) => {
      setProposals((p) => p.map(pr => pr.id === Number(proposalId) ? { ...pr, voteCount: pr.voteCount + 1 } : pr));
      if (voter.toLowerCase() === address?.toLowerCase()) {
        setVoterInfo(v => ({ ...v, hasVoted: true, votedProposal: Number(proposalId) }));
      }
    };
    contract.on('VoteCast', onVoteCast); handlers.push(['VoteCast', onVoteCast]);

    const onVoterRegistered = (voter) => {
      if (voter.toLowerCase() === address?.toLowerCase()) {
        setVoterInfo(v => ({ ...v, isRegistered: true }));
      }
    };
    contract.on('VoterRegistered', onVoterRegistered); handlers.push(['VoterRegistered', onVoterRegistered]);

    const onStatus = (status) => { setVotingActive(status); };
    contract.on('VotingStatusChanged', onStatus); handlers.push(['VotingStatusChanged', onStatus]);

    return () => {
      handlers.forEach(([ev, fn]) => {
        try { contract.off(ev, fn); } catch (_) {}
      });
    };
  }, [contract, address]);

  // Auto-refresh when dependencies ready
  useEffect(() => {
    refreshCore();
  }, [refreshCore]);

  return {
    connect,
    provider,
    signer,
    address,
    network,
    isOwner,
    owner,
    voterInfo,
    votingActive,
    proposals,
    winning,
    loading,
    error,
    txPending,
    setContractAddress,
    contractAddress,
    actions: { registerVoter, createProposal, setVotingStatus, vote, refresh: refreshCore }
  };
}
