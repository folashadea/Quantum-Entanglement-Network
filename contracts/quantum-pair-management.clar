;; Quantum Entanglement Pair Management Contract

(define-map entanglement-pairs
  { pair-id: uint }
  {
    generator: principal,
    recipient: (optional principal),
    status: (string-ascii 20),
    timestamp: uint
  }
)

(define-data-var pair-count uint u0)

(define-public (generate-pair)
  (let
    (
      (new-pair-id (+ (var-get pair-count) u1))
    )
    (map-set entanglement-pairs
      { pair-id: new-pair-id }
      {
        generator: tx-sender,
        recipient: none,
        status: "generated",
        timestamp: block-height
      }
    )
    (var-set pair-count new-pair-id)
    (ok new-pair-id)
  )
)

(define-public (distribute-pair (pair-id uint) (recipient principal))
  (let
    (
      (pair (unwrap! (map-get? entanglement-pairs { pair-id: pair-id }) (err u404)))
    )
    (asserts! (is-eq (get generator pair) tx-sender) (err u403))
    (asserts! (is-eq (get status pair) "generated") (err u400))
    (ok (map-set entanglement-pairs
      { pair-id: pair-id }
      (merge pair { recipient: (some recipient), status: "distributed" })
    ))
  )
)

(define-read-only (get-pair (pair-id uint))
  (ok (unwrap! (map-get? entanglement-pairs { pair-id: pair-id }) (err u404)))
)

(define-read-only (get-pair-count)
  (ok (var-get pair-count))
)

