
-- Table employees(id, name, dept, salary). For every department with at least 2 employees, return the department name, its headcount and its average salary — columns dept, headcount, avg_salary, ordered by average salary descending
-- Table: employees(id, name, dept, salary)
-- Columns to return: dept, headcount, avg_salary
SELECT dept, COUNT(id) as headcount, AVG(salary) as avg_salary FROM employees 
    GROUP BY dept HAVING headcount > 1 ORDER BY avg_salary DESC LIMIT 2 