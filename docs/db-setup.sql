-- Create databases for services (run in MySQL)
CREATE DATABASE IF NOT EXISTS product_service;
CREATE DATABASE IF NOT EXISTS inventory_service;
CREATE DATABASE IF NOT EXISTS order_service;
CREATE DATABASE IF NOT EXISTS auth_service;

-- Optional user creation (adjust password as desired)
-- CREATE USER 'appuser'@'%' IDENTIFIED BY 'StrongPassword123!';
-- GRANT ALL PRIVILEGES ON product_service.* TO 'appuser'@'%';
-- GRANT ALL PRIVILEGES ON inventory_service.* TO 'appuser'@'%';
-- GRANT ALL PRIVILEGES ON order_service.* TO 'appuser'@'%';
-- GRANT ALL PRIVILEGES ON auth_service.* TO 'appuser'@'%';
-- FLUSH PRIVILEGES;
