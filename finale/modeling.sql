
-- Company
--     name
--     id

--  -- - -- - -

-- Persons
--     name 
--     email
--     id
--     address
--     phone
--     date_joined

-- Employees
--     id 
--     job => enum("Mechanic", "Seller", "Other")
--     person_id => Persons

-- Customers
--     id NOT NULL
--     -- person_id => Persons

-- Cars
--     name
--     model NOT NULL
--     id NOT NULL
--     previous_owner_id? => Customers

-- Orders
--     id
--     type => enum("Repair", "Buy", "Sell")
--     cutomer_id NOT NULL => Customers
--     car_id NOT NULL => Cars
--     cost
--     receive_date
--     finish_date?
--     deadline?

-- OrderEmployees
--     order_id => Orders
--     employee_id => Employees

SELECT count(*) AS cars_sold, e.name As emp_name  FROM OrdersEmployees oe JOIN order e ON oe.order_id == e.id JOIN person p ON p.id = e.person_id
    WHERE e.type == 'Buy' GROUP BY e.id
