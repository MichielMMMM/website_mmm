CREATE TABLE agreement_acceptances (
  id TEXT PRIMARY KEY NOT NULL,
  full_name TEXT NOT NULL CHECK (length(full_name) BETWEEN 2 AND 200),
  mexem_account_number TEXT NOT NULL CHECK (length(mexem_account_number) BETWEEN 3 AND 32),
  strategy TEXT NOT NULL,
  strategy_label TEXT NOT NULL,
  document_name TEXT NOT NULL,
  document_version TEXT NOT NULL,
  document_date TEXT NOT NULL,
  consent_text TEXT NOT NULL,
  accepted INTEGER NOT NULL CHECK (accepted = 1),
  accepted_at TEXT NOT NULL
);
