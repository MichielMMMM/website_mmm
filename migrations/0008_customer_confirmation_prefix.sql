ALTER TABLE agreement_acceptances ADD COLUMN confirmation_prefix_base TEXT;

CREATE TABLE agreement_customer_prefixes (
  email TEXT PRIMARY KEY NOT NULL,
  base TEXT NOT NULL CHECK (length(base) BETWEEN 1 AND 4),
  ordinal INTEGER NOT NULL CHECK (ordinal > 0),
  prefix TEXT NOT NULL UNIQUE,
  UNIQUE (base, ordinal)
);

DROP TRIGGER agreement_assign_confirmation;
CREATE TRIGGER agreement_assign_confirmation
AFTER INSERT ON agreement_acceptances
WHEN NEW.confirmation_year IS NOT NULL
BEGIN
  INSERT INTO agreement_customer_prefixes (email, base, ordinal, prefix)
    SELECT lower(trim(NEW.email)), NEW.confirmation_prefix_base,
      coalesce(max(ordinal), 0) + 1,
      NEW.confirmation_prefix_base || CASE WHEN coalesce(max(ordinal), 0) = 0
        THEN '' ELSE CAST(max(ordinal) + 1 AS TEXT) END
    FROM agreement_customer_prefixes WHERE base = NEW.confirmation_prefix_base
    HAVING NEW.confirmation_prefix_base IS NOT NULL
    ON CONFLICT (email) DO NOTHING;
  INSERT INTO agreement_confirmation_sequences (year, sequence)
    VALUES (NEW.confirmation_year, 1)
    ON CONFLICT (year) DO UPDATE SET sequence = sequence + 1;
  UPDATE agreement_acceptances
    SET confirmation_number = (
      SELECT printf('%s-%d-%03d',
        CASE WHEN NEW.confirmation_prefix_base IS NULL THEN 'RUITAB'
          ELSE (SELECT prefix FROM agreement_customer_prefixes WHERE email = lower(trim(NEW.email))) END,
        year, sequence)
      FROM agreement_confirmation_sequences WHERE year = NEW.confirmation_year
    )
    WHERE id = NEW.id;
END;
