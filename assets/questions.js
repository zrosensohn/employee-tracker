const f = require('./functions');
const q = require('../crm');

var initial = [

    {
        type: "list",
        message: "What Would You Like To Do?",
        choices: [
            "View All Employees" //query all employees
            , "View All Employees by Department" // query all departments list as choices // query employees where depatment = choice
            , "View All Employees by Manager" // query all managers list as choices // query employees where manager = choice
            , "View Total Utilized Budget by Department" // query all departments list as choices //query salaries where department = choice
            , "Add Employee" // prompt fName // prompt lName // query all roles list as choices // query all employees list as choices // insert into employee table
            , "Delete Employee" // query all employees list as choices // delete from employee table
            , "Update Employee Role" // query all employees list as choices // query all roles list as choices // update selected employee role id with id of selected role
            , "Update Employee Manager" // query all employees list as choices // query all employees NEQ to selected employee // update selected employee with employee id of second question
            , "View All Roles" // query all roles
            , "Add Role" // prompt title // prompt salary // query all departments list as choices // insert into role table 
            , "Delete Role" // query all roles list as choices // delete choice from role table
            , "View All Departments" // query all departments
            , "Delete Department" // query all departments list as choices // delete choice from department table
            , "View All Managers" // query employee table return every distinct manager_id // query employee where employee_id === manager_id
            , "Exit"
        ],
        name: "choice"
    },
    {
        name: "employee",
        type: "list",
        message: "Select Employee",
        choices: async function() {
            let employees = await q.queryCommand("SELECT first_name, last_name FROM employee");
            let choices = await f.nameChoiceList(employees, "first_name", "last_name");
            return choices;
        },
        when: ({ choice }) => {
            if (choice === "Delete Employee"
             || choice === "Update Employee Role"
             || choice === "Update Employee Manager") {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "role_title",
        type: "input",
        message: "Enter Role Title",
        when: ({ choice }) => {
            if (choice === "Add Role") {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "role_salary",
        type: "number",
        message: "Enter Role Salary",
        when: ({ choice }) => {
            if (choice === "Add Role") {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "department",
        type: "list",
        choices: async function () {
            let departments = await q.queryCommand("SELECT dept_name FROM department");
            let choices = await f.choiceList(departments, "dept_name");
            return choices;
        },
        when: ({ choice }) => {
            if (choice === "View All Employees by Department" 
             || choice === "View Total Utilized Budget by Department"
             || choice === "Add Role"
             || choice === "Delete Department") {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "first_name",
        type: "input",
        message: "Employee First Name",
        when: ({ choice }) => {
            if (choice === "Add Employee") {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "last_name",
        type: "input",
        message: "Employee Last Name",
        when: ({ choice }) => {
            if (choice === "Add Employee") {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "role",
        type: "list",
        message: "Choose Role",
        choices: async function() {
            let roles = await q.queryCommand("SELECT title FROM roles");
            let choices = await f.choiceList(roles, "title");
            return choices;
        },
        when: ({ choice }) => {
            if (choice === "Add Employee"
             || choice === "Update Employee Role"
             || choice === "Delete Role" ) {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "manager",
        type: "list",
        message: "Select Manager",
        choices: async function () {
            let managers = await q.queryCommand(f.allManagerQuery);
            let choices = await f.nameChoiceList(managers, "manager_first_name", "manager_last_name");
            return choices;
        },
        when: ({ choice }) => {
            if (choice === "View All Employees by Manager") {
                return true;
            } else {
                return false;
            }
        }
    },
    {
        name: "newManager",
        type: "list",
        message: "Select Manager",
        choices: async function() {
            let managers = await q.queryCommand("SELECT first_name, last_name FROM employee");
            let choices = await f.nameChoiceList(managers, "first_name", "last_name");
            choices.push("Null");
            return choices;
        },
        when: ({ choice }) => {
            if (choice === "Add Employee"
             || choice === "Update Employee Manager") {
                 return true;
             } else {
                 return false;
             }
        }
    }

];

module.exports.initial = initial;