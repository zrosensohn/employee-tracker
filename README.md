# employee-tracker
Basic CLI application that mimics basic CMS functionality for a company
Assignment highlighting use of mysql and enquirer node packages.

## How to use

TAfter Databases Have Been Created and Seeded run `node crm.js`

CREATE DATABASE THAT CONTAINS THE FOLLOWING TABLES:

department:
- department_id - INT PRIMARY KEY
- dept_name - VARCHAR(30) to hold department name

role:
- role_id - INT PRIMARY KEY
- title -  VARCHAR(30) to hold role title
- salary -  DECIMAL to hold role salary
- department_id -  INT to hold reference to department role belongs to

employee:
- employee_id - INT PRIMARY KEY
- first_name - VARCHAR(30) to hold employee first name
- last_name - VARCHAR(30) to hold employee last name
- role_id - INT to hold reference to role employee has
- manager_id - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager

## Functionality

- View All Employees
- View All Employees by Department
- View All Employees by Manager
- View Total Utilized Budget by Department 
- Add Employee
- Delete Employee
- Update Employee Role
- Update Employee Manager
- View All Roles
- Add Role
- Delete Role
- View All Departments
- Delete Department
- View All Managers
- Exit
