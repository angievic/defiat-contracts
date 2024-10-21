;; Income Certificate Contract

;; Define error codes
(define-constant err-not-found u404)
(define-constant err-unauthorized u403)
(define-constant err-invalid-input u400)

;; Define data maps
(define-map user-wallets principal (string-utf8 80))
(define-map user-contracts 
  { user: principal, contract-id: uint} 
  { contract-file: (string-utf8 256), contract-amount: uint}) 
 
(define-map user-contract-count principal uint)

(define-map user-next-contract-id principal uint)

;; Define functions

;; Upload contract file and get a unique contract ID
(define-public (upload-contract (contract-file (string-utf8 256)) (contract-amount uint))
  (let (
        (contract-id (default-to u1 (map-get? user-next-contract-id tx-sender)))
        (current-contract-count (default-to u0 (map-get? user-contract-count tx-sender)))
        (new-count (+ current-contract-count u1)))
    (map-set user-next-contract-id tx-sender (+ contract-id u1))
    (map-set user-contract-count tx-sender new-count)
    (map-set user-contracts 
      { user: tx-sender, contract-id: contract-id } 
      { contract-file: contract-file, contract-amount: contract-amount })
    (ok contract-id)))

;; Function to get the contract count for a user
(define-read-only (get-user-contract-count (user principal))
  (default-to u0 (map-get? user-contract-count user)))

;; Get user's contract by ID
(define-read-only (get-user-contract (user principal) (contract-id uint))
  (map-get? user-contracts { user: user, contract-id: contract-id}))



