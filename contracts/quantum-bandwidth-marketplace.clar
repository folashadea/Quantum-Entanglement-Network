;; Quantum Communication Bandwidth Marketplace Contract

(define-fungible-token qbandwidth)

(define-map bandwidth-listings
  { listing-id: uint }
  {
    seller: principal,
    amount: uint,
    price: uint,
    expiration: uint
  }
)

(define-data-var listing-count uint u0)

(define-public (create-listing (amount uint) (price uint) (expiration uint))
  (let
    (
      (new-listing-id (+ (var-get listing-count) u1))
    )
    (try! (ft-transfer? qbandwidth amount tx-sender (as-contract tx-sender)))
    (map-set bandwidth-listings
      { listing-id: new-listing-id }
      {
        seller: tx-sender,
        amount: amount,
        price: price,
        expiration: (+ block-height expiration)
      }
    )
    (var-set listing-count new-listing-id)
    (ok new-listing-id)
  )
)

(define-public (purchase-bandwidth (listing-id uint))
  (let
    (
      (listing (unwrap! (map-get? bandwidth-listings { listing-id: listing-id }) (err u404)))
    )
    (asserts! (< block-height (get expiration listing)) (err u400))
    (try! (stx-transfer? (get price listing) tx-sender (get seller listing)))
    (try! (ft-transfer? qbandwidth (get amount listing) (as-contract tx-sender) tx-sender))
    (map-delete bandwidth-listings { listing-id: listing-id })
    (ok true)
  )
)

(define-read-only (get-listing (listing-id uint))
  (ok (unwrap! (map-get? bandwidth-listings { listing-id: listing-id }) (err u404)))
)

(define-read-only (get-listing-count)
  (ok (var-get listing-count))
)

