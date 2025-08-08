ALTER TABLE customers
    DROP CONSTRAINT customers_customer_value_check,
    ADD CONSTRAINT customers_customer_value_check
    CHECK (customer_value IN ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM'));
