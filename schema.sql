DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE employee (
    epmployee_id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER NULL,

    PRIMARY KEY (epmloyee_id),
    FOREIGN KEY (role_id),
    FOREIGN KEY (manager_id)
);

CREATE TABLE role (
    role_id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NULL,
    department_id INTEGER NOT NULL,

    PRIMARY KEY (role_id),
    FOREIGN KEY (department_id)
);

CREATE TABLE department (
    department_id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL

    PRIMARY KEY(department_id)
);