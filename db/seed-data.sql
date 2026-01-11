-- Seed data (stub) for local development
-- NOTE: Adjust table/column names to match your JPA entities and Flyway migrations.
-- If your services own separate databases, split this file per-service.

-- Example roles
-- INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN');

-- Example users (update hashing/encoding to match your PasswordEncoder)
-- INSERT INTO users (username, email, password, enabled) VALUES
--   ('admin', 'admin@example.com', '{bcrypt}$2a$10$REPLACE_WITH_BCRYPT_HASH', 1),
--   ('user1', 'user1@example.com', '{bcrypt}$2a$10$REPLACE_WITH_BCRYPT_HASH', 1);

-- Example products
-- CREATE TABLE IF NOT EXISTS products (
--   id BIGINT PRIMARY KEY AUTO_INCREMENT,
--   name VARCHAR(255) NOT NULL,
--   description TEXT,
--   price DECIMAL(10,2) NOT NULL,
--   category VARCHAR(100),
--   sku_code VARCHAR(100) UNIQUE,
--   quantity INT DEFAULT 0,
--   image_url VARCHAR(500)
-- );

-- INSERT INTO products (name, description, price, category, sku_code, quantity, image_url) VALUES
--   ('Wireless Headphones', 'Over-ear Bluetooth headphones', 199.99, 'electronics', 'SKU-HEADPHONES-001', 50, NULL),
--   ('Running Shoes', 'Lightweight running shoes', 89.99, 'fashion', 'SKU-SHOES-002', 120, NULL),
--   ('Coffee Maker', 'Automatic drip coffee maker', 59.99, 'home', 'SKU-COFFEE-003', 75, NULL);

-- Example orders (user-scoped) — to be aligned with your order-service schema
-- INSERT INTO orders (user_id, status, total_amount) VALUES (1, 'CREATED', 289.98);
