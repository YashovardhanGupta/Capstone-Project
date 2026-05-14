CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity_sold INT NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    sale_date DATE NOT NULL
);

INSERT INTO sales (product_name, category, quantity_sold, price_per_unit, sale_date) VALUES
('Laptop Pro', 'Electronics', 5, 1200.00, '2023-10-01'),
('Wireless Mouse', 'Accessories', 20, 25.00, '2023-10-02'),
('Standing Desk', 'Furniture', 2, 350.00, '2023-10-03'),
('Coffee Mug', 'Kitchen', 15, 12.50, '2023-10-04'),
('Mechanical Keyboard', 'Accessories', 8, 110.00, '2023-10-05');
