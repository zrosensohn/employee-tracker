const mysql = require('mysql');
const inq = require('inquirer');
const cTable = require('console.table');
const inqQuestions = require('./questions');
require('dotenv').config();

///////////////////////////////
// QUERY COMMANDS
///////////////////////////////

const con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.DBPASSWORD,
    database: "company_db"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + con.threadId);
    start();
});

function queryCommand(command, arr) {
    return new Promise(function(resolve, reject){
        
        con.query(command, arr, function(err, rows){
            if (err) return reject(err);
            return resolve(rows);
        })
        
    })
}

////////////////////////////////
// Switch Case
////////////////////////////////

async function start() {
    let initialResponse = await initialCLI();

    switch(initialResponse.choice){
        case "View All Employees":
            //DONE
            simpleQuery(allEmpQuery);
            break;

        case "View All Employees by Department":
            empByDept();
            //DONE
            break;

        case "View All Employees by Manager":
            empByManager();
            //DONE
            break;

        case "View Total Utilized Budget by Department":
            budgetByDept();
            //DONE
            break;

        case "Add Employee":
            addEmployee();
            //DONE
            break;
       
        case "Delete Employee":
            deleteEmployee();
            break;
        
        case "Update Employee Role":
            updateRole();
            break;
        
        case "Update Employee Manager":
            updateManager();
            break;
        
        case "View All Roles":
            //DONE
            simpleQuery("SELECT role_id, title, salary FROM roles");
            break;
        
        case "Add Role":
            addRole();
            break;
        
        case "Delete Role":
            deleteRole();
            break;
        
        case "View All Departments":
            //DONE
            simpleQuery("SELECT * FROM department");
            break;
        
        case "Delete Department":
            deleteDepartment();
            break;
        
        case "View All Managers":
            //DONE
            simpleQuery(allManagerQuery);
            break;
        
        case "Exit":
            con.end();
        break;                                                                                                        
    }
}

/////////////////////////////////
// 1 // Simple query and print
/////////////////////////////////

async function simpleQuery(query) {
    let rows = await queryCommand(query);
    console.table(rows);
    start();
}


/////////////////////////////////////////////
// 2 // View All Employees by Department
////////////////////////////////////////////
async function empByDept() {
    let departments = await queryCommand("SELECT department_id, dept_name FROM department");
    let choices = await choiceList(departments, "dept_name");
    inq.prompt({
        name: "department",
        type: "list",
        choices: choices
    }).then( async function(answer) { 
        var byDeptQuery = allEmpQuery + ' WHERE dept_name = ?;';
        let res = await queryCommand(byDeptQuery, [answer.department]);
        console.table(res);
        start();
    })
}


/////////////////////////////////////////////
// 3 // View All Employees by Manager
////////////////////////////////////////////

async function empByManager() {
    let managers = await queryCommand(allManagerQuery);
    let choices = await nameChoiceList(managers, "manager_first_name", "manager_last_name");
    inq.prompt({
        name: "manager",
        type: "list",
        choices: choices
    }).then( async function(answer){
        let managerName = answer.manager.split(" ");
        var byManagerQuery = allEmpQuery + ' WHERE manager.first_name = ? AND manager.last_name = ?;';
        let res = await queryCommand(byManagerQuery, [managerName[0], managerName[1]]);
        console.table(res);
        start();
    })
}


/////////////////////////////////////////////////
// 4 // View Total Utilized Budget by Department
/////////////////////////////////////////////////

async function budgetByDept() {
    let departments = await queryCommand("SELECT department_id, dept_name FROM department");
    let choices = await choiceList(departments, "dept_name");
    inq.prompt({
        name: "department",
        type: "list",
        choices: choices
    }).then( async function (answer) {
        let res = await queryCommand(budgetQuery, [answer.department]);
        console.table(res);
        start();
    })
}

/////////////////////////////////////////////////
// 5 // Add Employee
/////////////////////////////////////////////////

async function addEmployee() {
    let answers = await empQuestions();
    let idQuery = await queryCommand("SELECT role_id FROM roles WHERE title = ?", [answers.role]);
    let role_id = idQuery[0].role_id;

    let manager_id;
    if (answers.manager === "None") {
        manager_id = null;
    } else {
        let managerName = answers.manager.split(" ");
        let managerIdQuery = await queryCommand("SELECT employee_id FROM employee where first_name = ? AND last_name = ?", [managerName[0], managerName[1]]);
        manager_id = managerIdQuery[0].employee_id;
    }

    let query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)"
    let addEmp = await queryCommand(query, [answers.first_name, answers.last_name, role_id, manager_id]);
    
    console.log("Employee Added");
    start();
}



//////////////////////
// Utility functions
/////////////////////

//Initial Questions
function initialCLI(){
    return inq.prompt(inqQuestions.initial);
}

//add Employee questions
function empQuestions() {
    return inq.prompt(inqQuestions.employee);
}

//Return list of choices
function choiceList(rowPacket, colName) {
    return new Promise(function (resolve, reject) {
        var choices = [];
        rowPacket.forEach(row => {
            choices.push(row[colName]);
        })
        if (choices.length === 0 || choices === undefined) return reject("No Choices");
        return resolve(choices);
    })
}

//Return list of Name choices
function nameChoiceList(rowPacket, colName1, colName2) {
    return new Promise(function (resolve, reject) {
        var choices = [];
        rowPacket.forEach(row => {
            choices.push(row[colName1] + " " + row[colName2]);
        })
        if (choices.length === 0 || choices === undefined) return reject("No Managers");
        return resolve(choices);
    })
}


//////////////////////////////////
// Querys
//////////////////////////////////

var allEmpQuery = `SELECT emp.employee_id
, emp.first_name
, emp.last_name
, manager.first_name AS manager_first_name
, manager.last_name AS manager_last_name
, dept.dept_name AS department
FROM employee AS emp 
LEFT JOIN roles ON roles.role_id = emp.role_id 
LEFT JOIN employee AS manager ON emp.manager_id = manager.employee_id
LEFT JOIN department AS dept ON dept.department_id = roles.department_id`;

var allManagerQuery = `SELECT manager.first_name AS manager_first_name
, manager.last_name AS manager_last_name
FROM employee AS emp 
INNER JOIN employee AS manager ON emp.manager_id = manager.employee_id;`;

var budgetQuery  = `SELECT dept.dept_name AS Department, SUM(roles.salary) AS 'Total Utilized Budget'
FROM employee AS emp 
LEFT JOIN roles ON roles.role_id = emp.role_id 
LEFT JOIN department AS dept ON dept.department_id = roles.department_id
WHERE dept.dept_name = ?`;

module.exports.queryCommand = queryCommand;
module.exports.choiceList = choiceList;
module.exports.nameChoiceList = nameChoiceList;

//////////////////////////////////////
// Trash Can
//////////////////////////////////////

// function employeeByDept() {
//     con.query("SELECT department_id, dept_name FROM department",
//         function (err, res) {
//             if (err) throw err;
//             var choices = [];
//             res.forEach(row => {
//                 choices.push(row.dept_name);
//             })
//             inq.prompt({
//                 name: "department",
//                 type: "list",
//                 choices: choices
//             }).then(answer => {
//                 var byDeptQuery = allEmpQuery + ' WHERE dept_name = ?;';
//                 con.query(byDeptQuery, [answer.department], function (err, res) {
//                     if (err) throw err;
//                     if (res === undefined || res.length == 0) {
//                         console.log("No Employees In That Department");
//                     }
//                     console.table(res);
//                     start();
//                 })
//             })
//         }
//     )
// }

// function employeeByManager() {
//     con.query(allManagerQuery,
//         function (err, res) {
//             if (err) throw err;
//             var managers = [];
//             res.forEach(row => {
//                 managers.push(row.manager_first_name + " " + row.manager_last_name);
//             })
//             inq.prompt({
//                 name: "manager",
//                 type: "list",
//                 choices: managers
//             }).then(answer => {
//                 let managerName = answer.manager.split(" ");
//                 var byManagerQuery = allEmpQuery + ' WHERE manager.first_name = ? AND manager.last_name = ?;';
//                 con.query(byManagerQuery, [managerName[0], managerName[1]], function (err, res) {
//                     if (err) throw err;
//                     if (res === undefined || res.length == 0) {
//                         console.log("No Employees Have That Manager");
//                     }
//                     console.table(res);
//                     start();
//                 })
//             })
//         }
//     )
// }