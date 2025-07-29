-- Drop the old single "name" column now that we have first_name / last_name
ALTER TABLE customers DROP COLUMN name;
