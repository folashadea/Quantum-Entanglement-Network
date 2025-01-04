;; Quantum Network Governance Contract

(define-map proposals
  { proposal-id: uint }
  {
    proposer: principal,
    description: (string-utf8 1000),
    votes-for: uint,
    votes-against: uint,
    status: (string-ascii 20),
    execution-delay: uint
  }
)

(define-map votes
  { proposal-id: uint, voter: principal }
  { vote: bool }
)

(define-data-var proposal-count uint u0)

(define-constant min-voting-period u1440) ;; Minimum voting period in blocks (approximately 10 days)

(define-public (submit-proposal (description (string-utf8 1000)) (execution-delay uint))
  (let
    (
      (new-proposal-id (+ (var-get proposal-count) u1))
    )
    (map-set proposals
      { proposal-id: new-proposal-id }
      {
        proposer: tx-sender,
        description: description,
        votes-for: u0,
        votes-against: u0,
        status: "active",
        execution-delay: execution-delay
      }
    )
    (var-set proposal-count new-proposal-id)
    (ok new-proposal-id)
  )
)

(define-public (vote-on-proposal (proposal-id uint) (vote bool))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
    )
    (asserts! (is-eq (get status proposal) "active") (err u400))
    (map-set votes
      { proposal-id: proposal-id, voter: tx-sender }
      { vote: vote }
    )
    (if vote
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { votes-for: (+ (get votes-for proposal) u1) })
      )
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { votes-against: (+ (get votes-against proposal) u1) })
      )
    )
    (ok true)
  )
)

(define-public (execute-proposal (proposal-id uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
    )
    (asserts! (is-eq (get status proposal) "active") (err u400))
    (asserts! (>= (- block-height (get execution-delay proposal)) min-voting-period) (err u400))
    (if (> (get votes-for proposal) (get votes-against proposal))
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { status: "executed" })
      )
      (map-set proposals
        { proposal-id: proposal-id }
        (merge proposal { status: "rejected" })
      )
    )
    (ok true)
  )
)

(define-read-only (get-proposal (proposal-id uint))
  (ok (unwrap! (map-get? proposals { proposal-id: proposal-id }) (err u404)))
)

(define-read-only (get-proposal-count)
  (ok (var-get proposal-count))
)

