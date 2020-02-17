const mysql = require('mysql');
const inq = require('inquirer');
const {promisify} = require('util');
const cTable = require('console.table');
const initialQuestions = require('./questions');
require('dotenv').config();


const con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.DBPASSWORD,
    database: "company_db"
});

const queryAsync = promisify(con.query);

con.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + con.threadId);

    start();
});


async function start() {
    let initialResponse = await initialCLI();

    switch(initialResponse.choice){
        case "View All Employees":
            allEmployees()
            break;

        case "View All Employees by Department":
            employeeByDept();
            break;

        case "View All Employees by Manager":
            employeeByManager();
            break;

        case "View Total Utilized Budget by Department":
        break;
        case "Add Employee":
        break;
        case "Delete Employee":
        break;
        case "Update Employee Role":
        break;
        case "Update Employee Manager":
        break;
        case "View All Roles":
        break;
        case "Add Role":
        break;
        case "Delete Role":
        break;
        case "View All Departments":
        break;
        case "Delete Department":
        break;
        case "View All Managers":
        break;
        case "Exit":
            con.end();
        break;                                                                                                        
    }
}

//Initial Questions
function initialCLI(){
    return inq.prompt(initialQuestions);
}


///////////////////////////////////
// 1 // View all Employees
///////////////////////////////////
function allEmployees() {
    con.query(allEmpQuery,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        }
    )
}

/////////////////////////////////////////////
// 2 // View All Employees by Department
////////////////////////////////////////////
function employeeByDept() {
    con.query("SELECT department_id, dept_name FROM department",
        function (err, res) {
            if (err) throw err;
            var choices = [];
            res.forEach(row => {
                choices.push(row.dept_name);
            })
            inq.prompt({
                name: "department",
                type: "list",
                choices: choices
            }).then(answer => {
                var byDeptQuery = allEmpQuery + ' WHERE dept_name = ?;';
                con.query(byDeptQuery, [answer.department], function (err, res) {
                    if (err) throw err;
                    if (res === undefined || res.length == 0) {
                        console.log("No Employees In That Department");
                    }
                    console.table(res);
                    start();
                })
            })
        }
    )
}

/////////////////////////////////////////////
// 3 // View All Employees by Manager
////////////////////////////////////////////
function employeeByManager() {
    con.query(allManagerQuery,
        function (err, res) {
            if (err) throw err;
            var managers = [];
            res.forEach(row => {
                managers.push(row.manager_first_name + " " + row.manager_last_name);
            })
            inq.prompt({
                name: "manager",
                type: "list",
                choices: managers
            }).then(answer => {
                let managerName = answer.manager.split(" ");
                var byManagerQuery = allEmpQuery + ' WHERE manager.first_name = ? AND manager.last_name = ?;';
                con.query(byManagerQuery, [managerName[0], managerName[1]], function (err, res) {
                    if (err) throw err;
                    if (res === undefined || res.length == 0) {
                        console.log("No Employees Have That Manager");
                    }
                    console.table(res);
                    start();
                })
            })
        }
    )
}

var allEmpQuery = `SELECT emp.employee_id
, emp.first_name
, emp.last_name
, manager.first_name AS manager_first_name
, manager.last_name AS manager_last_name
, dept.dept_name AS department
FROM employee AS emp 
LEFT JOIN roles ON roles.role_id = emp.role_id 
LEFT JOIN employee AS manager ON emp.manager_id = manager.employee_id
LEFT JOIN department AS dept ON dept.department_id = roles.department_id`

var allManagerQuery = `SELECT manager.first_name AS manager_first_name
, manager.last_name AS manager_last_name
FROM employee AS emp 
INNER JOIN employee AS manager ON emp.manager_id = manager.employee_id;`