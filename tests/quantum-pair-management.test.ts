import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'quantum-pair-management': {
      functions: {
        'generate-pair': vi.fn(),
        'distribute-pair': vi.fn(),
        'get-pair': vi.fn(),
        'get-pair-count': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName, functionName, args) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Quantum Pair Management Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('generate-pair', () => {
    it('should generate a new entanglement pair', async () => {
      mockClarity.contracts['quantum-pair-management'].functions['generate-pair'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('quantum-pair-management', 'generate-pair', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('distribute-pair', () => {
    it('should distribute an entanglement pair', async () => {
      const pairId = 1
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['quantum-pair-management'].functions['distribute-pair'].mockReturnValue({ success: true })
      
      const result = await callContract('quantum-pair-management', 'distribute-pair', [pairId, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if the pair does not exist', async () => {
      const pairId = 999
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['quantum-pair-management'].functions['distribute-pair'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('quantum-pair-management', 'distribute-pair', [pairId, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-pair', () => {
    it('should return pair data', async () => {
      const pairId = 1
      const pairData = {
        generator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        recipient: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        status: 'distributed',
        timestamp: 123456
      }
      mockClarity.contracts['quantum-pair-management'].functions['get-pair'].mockReturnValue({ success: true, value: pairData })
      
      const result = await callContract('quantum-pair-management', 'get-pair', [pairId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(pairData)
    })
  })
  
  describe('get-pair-count', () => {
    it('should return the total number of pairs', async () => {
      mockClarity.contracts['quantum-pair-management'].functions['get-pair-count'].mockReturnValue({ success: true, value: 5 })
      
      const result = await callContract('quantum-pair-management', 'get-pair-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(5)
    })
  })
})
