-- MySQL 8+ seed: insert 100 products matching your table schema
-- Table columns (from attachment): id (auto), description, name, price, sku_code
-- Adjust table/column names if your schema is different.

-- Optionally clear existing rows first (CAUTION!)
-- TRUNCATE TABLE products;

WITH RECURSIVE seq AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 100
)
INSERT INTO products (name, description, price, sku_code)
SELECT
  CONCAT('Product ', LPAD(n, 3, '0')) AS name,
  CONCAT('Sample description for product ', n, '. High quality item for demo and testing.') AS description,
  ROUND(9.99 + (n * 1.35), 2) AS price,
  CONCAT('SKU-', LPAD(n, 3, '0')) AS sku_code
FROM seq;

-- Notes:
-- 1) Images: The frontend derives image URLs from SKU pattern automatically, no DB column needed.
--    Pattern: SKU-001 → /assests/products/product-001.jpg (see frontend/src/services/images.js)
--    Place files at: frontend/public/assests/products/product-001.jpg ... product-100.jpg
--    (Folder name is intentionally 'assests' to match your project.)
-- 2) If you need to re-run this on MySQL 5.7 (no recursive CTE), create a helper numbers table:
--    CREATE TEMPORARY TABLE nums (n INT PRIMARY KEY);
--    INSERT INTO nums(n) VALUES (1),(2),(3),(4),(5),(6),(7),(8),(9),(10);
--    -- Build up to 100 via cross join
--    CREATE TEMPORARY TABLE seq AS
--    SELECT (a.n + (b.n-1)*10) AS n FROM nums a CROSS JOIN nums b;
--    -- Then run the same INSERT ... SELECT using FROM seq
