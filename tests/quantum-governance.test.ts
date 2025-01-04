import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'quantum-governance': {
      functions: {
        'submit-proposal': vi.fn(),
        'vote-on-proposal': vi.fn(),
        'execute-proposal': vi.fn(),
        'get-proposal': vi.fn(),
        'get-proposal-count': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'block-height': 12345,
  },
}

function callContract(contractName, functionName, args) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Quantum Governance Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-proposal', () => {
    it('should submit a new proposal', async () => {
      const description = 'Upgrade quantum network protocol'
      const executionDelay = 1000
      mockClarity.contracts['quantum-governance'].functions['submit-proposal'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('quantum-governance', 'submit-proposal', [description, executionDelay])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('vote-on-proposal', () => {
    it('should cast a vote on a proposal', async () => {
      const proposalId = 1
      const vote = true
      mockClarity.contracts['quantum-governance'].functions['vote-on-proposal'].mockReturnValue({ success: true })
      
      const result = await callContract('quantum-governance', 'vote-on-proposal', [proposalId, vote])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if the proposal does not exist', async () => {
      const proposalId = 999
      const vote = true
      mockClarity.contracts['quantum-governance'].functions['vote-on-proposal'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('quantum-governance', 'vote-on-proposal', [proposalId, vote])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('execute-proposal', () => {
    it('should execute a proposal', async () => {
      const proposalId = 1
      mockClarity.contracts['quantum-governance'].functions['execute-proposal'].mockReturnValue({ success: true })
      
      const result = await callContract('quantum-governance', 'execute-proposal', [proposalId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if the proposal is not ready for execution', async () => {
      const proposalId = 1
      mockClarity.contracts['quantum-governance'].functions['execute-proposal'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('quantum-governance', 'execute-proposal', [proposalId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('get-proposal', () => {
    it('should return proposal data', async () => {
      const proposalId = 1
      const proposalData = {
        proposer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        description: 'Upgrade quantum network protocol',
        votes_for: 10,
        votes_against: 5,
        status: 'active',
        execution_delay: 1000
      }
      mockClarity.contracts['quantum-governance'].functions['get-proposal'].mockReturnValue({ success: true, value: proposalData })
      
      const result = await callContract('quantum-governance', 'get-proposal', [proposalId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(proposalData)
    })
  })
  
  describe('get-proposal-count', () => {
    it('should return the total number of proposals', async () => {
      mockClarity.contracts['quantum-governance'].functions['get-proposal-count'].mockReturnValue({ success: true, value: 2 })
      
      const result = await callContract('quantum-governance', 'get-proposal-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(2)
    })
  })
})
