-- Compatibility seed for MySQL/MariaDB without USING CTE in INSERT
-- Table columns: id (auto), description, name, price, sku_code
-- Run this if you hit error 1064 with the CTE version.

-- Optionally clear existing rows first (CAUTION!)
-- TRUNCATE TABLE products;

-- 1) Build a numbers table 1..10
CREATE TEMPORARY TABLE IF NOT EXISTS nums (n INT PRIMARY KEY);
INSERT INTO nums(n) VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10)
ON DUPLICATE KEY UPDATE n = VALUES(n);

-- 2) Cross join to generate 1..100
CREATE TEMPORARY TABLE IF NOT EXISTS seq AS
SELECT (a.n + (b.n - 1) * 10) AS n
FROM nums a
CROSS JOIN nums b;

-- 3) Insert 100 products
INSERT INTO products (name, description, price, sku_code)
SELECT
  CONCAT('Product ', LPAD(n, 3, '0')) AS name,
  CONCAT('Sample description for product ', n, '. High quality item for demo and testing.') AS description,
  ROUND(9.99 + (n * 1.35), 2) AS price,
  CONCAT('SKU-', LPAD(n, 3, '0')) AS sku_code
FROM seq
ORDER BY n;

-- 4) Cleanup
DROP TEMPORARY TABLE IF EXISTS seq;
DROP TEMPORARY TABLE IF EXISTS nums;
