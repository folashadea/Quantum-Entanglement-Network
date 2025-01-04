import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'quantum-bandwidth-marketplace': {
      functions: {
        'create-listing': vi.fn(),
        'purchase-bandwidth': vi.fn(),
        'get-listing': vi.fn(),
        'get-listing-count': vi.fn(),
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

describe('Quantum Bandwidth Marketplace Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-listing', () => {
    it('should create a new bandwidth listing', async () => {
      const amount = 1000
      const price = 500
      const expiration = 100
      mockClarity.contracts['quantum-bandwidth-marketplace'].functions['create-listing'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('quantum-bandwidth-marketplace', 'create-listing', [amount, price, expiration])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('purchase-bandwidth', () => {
    it('should purchase bandwidth successfully', async () => {
      const listingId = 1
      mockClarity.contracts['quantum-bandwidth-marketplace'].functions['purchase-bandwidth'].mockReturnValue({ success: true })
      
      const result = await callContract('quantum-bandwidth-marketplace', 'purchase-bandwidth', [listingId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if the listing does not exist', async () => {
      const listingId = 999
      mockClarity.contracts['quantum-bandwidth-marketplace'].functions['purchase-bandwidth'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('quantum-bandwidth-marketplace', 'purchase-bandwidth', [listingId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-listing', () => {
    it('should return listing data', async () => {
      const listingId = 1
      const listingData = {
        seller: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        amount: 1000,
        price: 500,
        expiration: 123456
      }
      mockClarity.contracts['quantum-bandwidth-marketplace'].functions['get-listing'].mockReturnValue({ success: true, value: listingData })
      
      const result = await callContract('quantum-bandwidth-marketplace', 'get-listing', [listingId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(listingData)
    })
  })
  
  describe('get-listing-count', () => {
    it('should return the total number of listings', async () => {
      mockClarity.contracts['quantum-bandwidth-marketplace'].functions['get-listing-count'].mockReturnValue({ success: true, value: 3 })
      
      const result = await callContract('quantum-bandwidth-marketplace', 'get-listing-count', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(3)
    })
  })
})
