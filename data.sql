-- Sample INSERT Statements for Financial Advising Company Schema
use crm;
-- Inserting data into Companies
INSERT INTO Companies (name, description) VALUES
('Alpha Investments', 'A leading investment firm specializing in stocks and bonds'),
('Beta Financial Services', 'Offers a wide range of financial services including wealth management'),
('Gamma Capital', 'Focused on private equity and venture capital investments');

-- Inserting data into Customers
INSERT INTO Customers (first_name, last_name, rating, company_id) VALUES
('John', 'Doe', 5, 1),
('Jane', 'Smith', 4, 2),
('Alice', 'Johnson', 3, 3);

-- Inserting data into Departments
INSERT INTO Departments (name) VALUES
('Sales'),
('Marketing'),
('Finance');

-- Inserting data into Employees
INSERT INTO Employees (first_name, last_name, designation, department_id, contact, date_joined ) VALUES
('Robert', 'Brown','Admin Assistance', 1,'234-345-4576','2000-02-15'),
('Emily', 'Davis','Admin Assistance', 1,'234-345-8574','2018-01-15'),
('Michael', 'Wilson','Admin Assistance', 2,'234-345-7986','2020-01-15' ),
('John','Doe', 'Manager', 1, '123-456-7890', '2020-01-15'),
('Jane', 'Smith', 'Developer', 2, '234-567-8901', '2019-03-10'),
('Michael', 'Brown', 'Analyst', 1, '345-678-9012', '2021-05-22'),
('Emily', 'Davis', 'HR Specialist', 3, '456-789-0123', '2018-07-30'),
('James','Wilson', 'Designer', 3, '567-890-1234', '2020-09-11'),
('Sarah', 'Johnson', 'Marketing Specialist', 2, '678-901-2345', '2019-11-25'),
('David', 'Lee', 'Accountant', 1, '789-012-3456', '2021-01-18'),
('Laura', 'Walker', 'Software Engineer', 2, '890-123-4567', '2020-02-28'),
('Daniel','Young', 'Data Scientist', 3, '901-234-5678', '2019-04-14'),
('Olivia', 'Martinez', 'UX Designer', 3, '123-345-6789', '2021-06-09'),
('Henry', 'Lopez', 'Product Manager', 3, '234-456-7890', '2018-08-21'),
('Emma', 'Taylor', 'Content Writer', 1, '345-567-8901', '2020-10-16'),
('Alexander', 'White', 'Tech Lead', 2, '456-678-9012', '2019-12-01'),
('Sophia', 'Hall', 'Customer Support', 3, '567-789-0123', '2021-03-15'),
('Christopher', 'King', 'Sales Associate', 3, '678-890-1234', '2020-05-20'),
('Isabella', 'Scott', 'HR Manager', 3, '789-901-2345', '2018-10-10'),
('Ethan', 'Green', 'Operations Manager', 1, '890-012-3456', '2021-01-29'),
('Amelia', 'Adams', 'Data Analyst', 2, '901-123-4567', '2019-06-18'),
('Matthew', 'Baker', 'Quality Assurance', 3, '123-234-5678', '2020-11-03'),
('Ava', 'Gonzalez', 'Social Media Manager', 2, '234-345-6789', '2019-07-22');

-- Inserting data into Products
INSERT INTO Products (name, description) VALUES
('Investment Plan A', 'Comprehensive investment plan for long-term growth'),
('Retirement Fund B', 'Retirement fund with a focus on stability and steady income'),
('Equity Package C', 'Diverse equity package for aggressive growth');

-- Inserting data into Sales
INSERT INTO Sales (product_id, employee_id, customer_id, quantity, sale_date) VALUES
(1, 1, 1, 10, '2024-01-15'),
(2, 1, 2, 5, '2024-01-20'),
(3, 2, 3, 15, '2024-01-25');

-- Inserting data into EmployeeCustomer
INSERT INTO EmployeeCustomer (employee_id, customer_id) VALUES
(1, 1),
(2, 2),
(1, 3);

-- Inserting data into EmployeeProduct
INSERT INTO EmployeeProduct (employee_id, product_id) VALUES
(1, 1),
(1, 2),
(2, 3);