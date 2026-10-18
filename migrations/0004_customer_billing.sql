ALTER TABLE agreement_acceptances ADD COLUMN initials TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN first_name TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN last_name TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN company_name TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN phone TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN postcode TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN house_number TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN house_number_addition TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN street TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN city TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN country TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN notes TEXT;
ALTER TABLE agreement_acceptances ADD COLUMN confirmation_year INTEGER;
ALTER TABLE agreement_acceptances ADD COLUMN confirmation_number TEXT;

CREATE UNIQUE INDEX agreement_confirmation_number_unique
  ON agreement_acceptances (confirmation_number);

CREATE TABLE agreement_confirmation_sequences (
  year INTEGER PRIMARY KEY NOT NULL,
  sequence INTEGER NOT NULL CHECK (sequence > 0)
);

-- The trigger runs inside the insert transaction, including concurrent requests.
CREATE TRIGGER agreement_assign_confirmation
AFTER INSERT ON agreement_acceptances
WHEN NEW.confirmation_year IS NOT NULL
BEGIN
  INSERT INTO agreement_confirmation_sequences (year, sequence)
    VALUES (NEW.confirmation_year, 1)
    ON CONFLICT (year) DO UPDATE SET sequence = sequence + 1;
  UPDATE agreement_acceptances
    SET confirmation_number = (
      SELECT printf('RUITAB-%d-%03d', year, sequence)
      FROM agreement_confirmation_sequences WHERE year = NEW.confirmation_year
    )
    WHERE id = NEW.id;
END;
