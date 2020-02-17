USE company_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Amy", "Siedlecki", 2, 2)    -- salesperson
,("Zac", "Rosensohn", 1)            -- sales lead
,("Trevor", "Ballinger", 5,)        -- legal team lead
,("Sarah", "Esposito", 3)           -- lead engineer
,("Jerome", "Finstein", 4, 3)       -- software engineer
,("Beth", "Stepski", 7)             -- head of accounting
,("Kayla", "Peterson", 8, 7);       -- accountant

-----------------
--ROLES
------------------
--1 Sales Lead
--2 Salesperson
--3 Lead Engineer
--4 Software Engineer
--5 Legal Team Lead
--6 Lawyer
--7 Head of Accounting
--8 Accountant

INSERT INTO role (title ,salary ,department_id)
VALUES("Sales Lead" ,100000, 1)
,("Salesperson", 52000, 1)
,("Lead Engineer", 130000, 2)
,("Software Engineer", 85000, 2)
,("Legal Team Lead", 110000, 3)
,("Lawyer", 75000, 3)
,("Head of Accounting", 95000, 4)
,("Accountant", 62000, 4);


-----------------
--DEPARTMENTS
------------------
--1 Sales
--2 Engineering
--3 Legal
--4 Finance

INSERT INTO department (dept_name)
VALUES("Sales"),("Engineering"),("Legal"),("Finance");