;; Quantum Key Distribution Integration Contract

(define-map quantum-keys
  { key-id: uint }
  {
    owner: principal,
    public-key: (buff 32),
    expiration: uint
  }
)

(define-data-var key-count uint u0)

(define-public (register-quantum-key (public-key (buff 32)) (expiration uint))
  (let
    (
      (new-key-id (+ (var-get key-count) u1))
    )
    (map-set quantum-keys
      { key-id: new-key-id }
      {
        owner: tx-sender,
        public-key: public-key,
        expiration: (+ block-height expiration)
      }
    )
    (var-set key-count new-key-id)
    (ok new-key-id)
  )
)

(define-public (revoke-quantum-key (key-id uint))
  (let
    (
      (key (unwrap! (map-get? quantum-keys { key-id: key-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get owner key)) (err u403))
    (map-delete quantum-keys { key-id: key-id })
    (ok true)
  )
)

(define-read-only (get-quantum-key (key-id uint))
  (ok (unwrap! (map-get? quantum-keys { key-id: key-id }) (err u404)))
)

(define-read-only (is-key-valid (key-id uint))
  (match (map-get? quantum-keys { key-id: key-id })
    key (ok (> (get expiration key) block-height))
    (err u404)
  )
)

(define-read-only (get-key-count)
  (ok (var-get key-count))
)

