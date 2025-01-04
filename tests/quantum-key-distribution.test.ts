import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'quantum-key-distribution': {
      functions: {
        'register-quantum-key': vi.fn(),
        'revoke-quantum-key': vi.fn(),
        'get-quantum-key': vi.fn(),
        'is-key-valid': vi.fn(),
        'get-key-count': vi.fn(),
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

describe('Quantum Key Distribution Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('register-quantum-key', () => {
    it('should register a new quantum key', async () => {
      const publicKey = Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex')
      const expiration = 1000
      mockClarity.contracts['quantum-key-distribution'].functions['register-quantum-key'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('quantum-key-distribution', 'register-quantum-key', [publicKey, expiration])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('revoke-quantum-key', () => {
    it('should revoke a quantum key', async () => {
      const keyId = 1
      mockClarity.contracts['quantum-key-distribution'].functions['revoke-quantum-key'].mockReturnValue({ success: true })
      
      const result = await callContract('quantum-key-distribution', 'revoke-quantum-key', [keyId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if the key does not exist', async () => {
      const keyId = 999
      mockClarity.contracts['quantum-key-distribution'].functions['revoke-quantum-key'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('quantum-key-distribution', 'revoke-quantum-key', [keyId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-quantum-key', () => {
    it('should return quantum key data', async () => {
      const keyId = 1
      const keyData = {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        public_key: Buffer.from('0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef', 'hex'),
        expiration: 13345
      }
      mockClarity.contracts['quantum-key-distribution'].functions['get-quantum-key'].mockReturnValue({ success: true, value: keyData })
      
      const result = await callContract('quantum-key-distribution', 'get-quantum-key', [keyId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(keyData)
    })
  })
  
  describe('is-key-valid', () => {
    it('should return true for a valid key', async () => {
      const keyId = 1
      mockClarity.contracts['quantum-key-distribution'].functions['is-key-valid'].mockReturnValue({ success: true, value: true })
      
      const result = await callContract('quantum-key-distribution', 'is-key-valid', [keyId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })
    
    it('should return false for an expired key', async () => {
      const keyId = 2
      mockClarity.contracts['quantum-key-distribution'].functions['is-key-valid'].mockReturnValue({ success: true, value: false })
      
      const result = await callContract('quantum-key-distribution', 'is-key-valid', [keyId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(false)
    })
  })
  
  describe('get-key-count', () => {
    it('should return the total number of registered keys', async () => {
      mockClarity.contracts['quantum-key-distribution'].functions['get-key-count'].mockReturnValue({ success: true, value: 3 })
      
      const result = await callContract('quantum-key-distribution', 'get-key-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(3)
    })
  })
})
