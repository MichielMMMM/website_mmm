ALTER TABLE agreement_acceptances ADD COLUMN salutation TEXT CHECK (salutation IN ('heer', 'mevrouw', 'neutraal'));
