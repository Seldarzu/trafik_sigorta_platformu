ALTER TABLE customers
  RENAME COLUMN tc_no TO tc_number;

ALTER INDEX ukgb30uemu7k84ngivv5yjkbagf
  RENAME TO uk_customers_tc_number;
